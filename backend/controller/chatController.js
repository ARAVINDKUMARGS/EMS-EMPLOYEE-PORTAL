const db = require("../db");

// Get contacts for logged-in user
exports.getContacts = (req, res) => {
  const employeeId = req.user.employee_id;

  const query = `
    SELECT
      e.employee_id AS id,
      e.name,
      e.role,
      d.name AS department,
      COALESCE(
        (SELECT text FROM messages
         WHERE (sender_id = e.employee_id AND conversation_id IN (
           SELECT conversation_id FROM conversation_members WHERE employee_id = ?
         )) OR (sender_id = ? AND conversation_id IN (
           SELECT conversation_id FROM conversation_members WHERE employee_id = e.employee_id
         ))
         ORDER BY id DESC LIMIT 1), 'Click to start chatting'
      ) AS lastMessage,
      'Online' AS status
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.employee_id != ? AND e.approval_status = 'Approved'
    ORDER BY e.name ASC
  `;

  db.query(query, [employeeId, employeeId, employeeId], (err, rows) => {
    if (err) {
      console.error("GET CONTACTS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows.map((r) => ({ ...r, avatar: r.name.charAt(0) })));
  });
};

// Helper function to find or create direct conversation between two users
function getOrCreateConversation(user1, user2) {
  return new Promise((resolve, reject) => {
    const findQuery = `
      SELECT cm1.conversation_id
      FROM conversation_members cm1
      JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
      JOIN conversations c ON c.id = cm1.conversation_id
      WHERE cm1.employee_id = ? AND cm2.employee_id = ? AND c.is_group = 0
      LIMIT 1
    `;

    db.query(findQuery, [user1, user2], (err, rows) => {
      if (err) return reject(err);
      if (rows.length > 0) return resolve(rows[0].conversation_id);

      db.query("INSERT INTO conversations (is_group) VALUES (0)", (err, result) => {
        if (err) return reject(err);
        const convId = result.insertId;
        const memberSql = "INSERT INTO conversation_members (conversation_id, employee_id) VALUES (?, ?), (?, ?)";
        db.query(memberSql, [convId, user1, convId, user2], (err) => {
          if (err) return reject(err);
          resolve(convId);
        });
      });
    });
  });
}

// Get messages for a contact
exports.getMessages = async (req, res) => {
  const { contactId } = req.params;
  const currentUserId = req.user.employee_id;

  try {
    const convId = await getOrCreateConversation(currentUserId, contactId);

    const query = `
      SELECT id, sender_id, message_type AS messageType, text, file_name AS fileName,
             file_type AS fileType, file_url AS fileUrl, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY id ASC
    `;

    db.query(query, [convId], (err, rows) => {
      if (err) return res.status(500).json(err);

      const formatted = rows.map((m) => ({
        id: m.id,
        type: m.sender_id === currentUserId ? "sent" : "received",
        messageType: m.messageType,
        text: m.text,
        fileName: m.fileName,
        fileType: m.fileType,
        fileUrl: m.fileUrl,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
      }));

      res.json(formatted);
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to load chat history" });
  }
};

// Send message (text or file)
exports.sendMessage = async (req, res) => {
  const { contactId, text, messageType, fileName, fileType, fileUrl } = req.body;
  const currentUserId = req.user.employee_id;

  try {
    const convId = await getOrCreateConversation(currentUserId, contactId);

    const query = `
      INSERT INTO messages (conversation_id, sender_id, message_type, text, file_name, file_type, file_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [convId, currentUserId, messageType || "text", text || null, fileName || null, fileType || null, fileUrl || null],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
          id: result.insertId,
          type: "sent",
          messageType: messageType || "text",
          text,
          fileName,
          fileType,
          fileUrl,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        });
      }
    );
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Clear conversation
exports.clearConversation = async (req, res) => {
  const { contactId } = req.params;
  const currentUserId = req.user.employee_id;

  try {
    const convId = await getOrCreateConversation(currentUserId, contactId);
    db.query("DELETE FROM messages WHERE conversation_id = ?", [convId], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Conversation history cleared" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
