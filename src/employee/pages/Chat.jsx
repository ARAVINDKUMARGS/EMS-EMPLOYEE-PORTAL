import "../styles/Chat.css";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import ContactList from "../components/chat/ContactList";
import ChatWindow from "../components/chat/ChatWindow";
import { getContacts, getMessages, sendMessage as apiSendMessage, clearConversation as apiClearConversation } from "../services/chatService";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);

  // Load contacts list on mount
  useEffect(() => {
    getContacts()
      .then((res) => {
        setContacts(res.data);
        if (res.data.length > 0) {
          setSelectedContact(res.data[0]);
        }
      })
      .catch((err) => {
        console.error("Fetch contacts error:", err);
        toast.error("Failed to load contacts");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch messages when selectedContact changes
  useEffect(() => {
    if (selectedContact?.id) {
      getMessages(selectedContact.id)
        .then((res) => {
          setMessages((prev) => ({
            ...prev,
            [selectedContact.id]: res.data,
          }));
        })
        .catch((err) => console.error("Fetch messages error:", err));
    }
  }, [selectedContact?.id]);

  // Open Chat
  const openChat = (contact) => {
    setSelectedContact(contact);
  };

  // Send Message (Text + File)
  const handleSendMessage = async (data) => {
    if (!selectedContact) return;

    try {
      const payload = {
        contactId: selectedContact.id,
        messageType: data.messageType || "text",
        text: data.text,
        fileName: data.fileName,
        fileType: data.fileType,
        fileUrl: data.fileUrl,
      };

      const res = await apiSendMessage(payload);
      const newMessage = res.data;

      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
      }));

      // Update contact last message
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? { ...c, lastMessage: data.messageType === "file" ? `📎 ${data.fileName}` : data.text }
            : c
        )
      );
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message");
    }
  };

  // Clear Conversation
  const handleClearConversation = async () => {
    if (!selectedContact) return;
    try {
      await apiClearConversation(selectedContact.id);
      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [],
      }));
      toast.success("Conversation cleared");
    } catch (err) {
      toast.error("Failed to clear conversation");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground p-6">Loading chat conversations...</p>;
  }

  return (
    <div className="chat-page">
      <aside className="left-panel">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          setSelectedContact={openChat}
        />
      </aside>

      <main className="right-panel">
        {selectedContact ? (
          <ChatWindow
            selectedContact={selectedContact}
            messages={messages}
            sendMessage={handleSendMessage}
            clearConversation={handleClearConversation}
          />
        ) : (
          <p className="text-center text-muted-foreground mt-12">Select a contact to start messaging.</p>
        )}
      </main>
    </div>
  );
}

export default Chat;