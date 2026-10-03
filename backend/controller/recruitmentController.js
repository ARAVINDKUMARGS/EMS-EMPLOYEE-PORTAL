const db = require("../db");

// Get Jobs List with applicant counts
exports.getJobs = (req, res) => {
  const query = `
    SELECT j.*, COUNT(ja.id) AS candidate_count
    FROM jobs j
    LEFT JOIN job_applications ja ON ja.job_id = j.id
    GROUP BY j.id
    ORDER BY j.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department_name || "Engineering",
      location: j.location,
      type: j.type,
      experience: j.experience,
      salary: j.salary_range,
      status: j.status,
      posted: j.posted_date ? new Date(j.posted_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
      candidateIds: Array(j.candidate_count).fill(0).map((_, i) => i + 1),
      description: j.description,
    })));
  });
};

// Get Single Job Details
exports.getJobDetails = (req, res) => {
  const { id } = req.params;

  const jobQuery = `SELECT * FROM jobs WHERE id = ?`;
  const candidatesQuery = `
    SELECT c.*, ja.stage, ja.match_score, ja.applied_date, ja.id AS application_id
    FROM job_applications ja
    JOIN candidates c ON c.id = ja.candidate_id
    WHERE ja.job_id = ?
  `;

  db.query(jobQuery, [id], (err, jobRows) => {
    if (err || jobRows.length === 0) return res.status(404).json({ message: "Job not found" });

    db.query(candidatesQuery, [id], (err, candidateRows) => {
      if (err) return res.status(500).json(err);
      res.json({
        job: jobRows[0],
        candidates: candidateRows,
      });
    });
  });
};

// Create Job Opening
exports.createJob = (req, res) => {
  const { title, department_name, location, type, experience, salary_range, description } = req.body;

  if (!title) return res.status(400).json({ message: "Job title is required" });

  const query = `
    INSERT INTO jobs (title, department_name, location, type, experience, salary_range, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
  `;

  db.query(
    query,
    [title, department_name || "Engineering", location || "San Francisco, CA", type || "Full-time", experience || "3+ years", salary_range || "$120k - $150k", description || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Job posted successfully", id: result.insertId });
    }
  );
};

// Get Candidates List
exports.getCandidates = (req, res) => {
  const query = `
    SELECT c.*, ja.id AS application_id, ja.job_id, ja.stage, ja.match_score, j.title AS job_title
    FROM candidates c
    LEFT JOIN job_applications ja ON ja.candidate_id = c.id
    LEFT JOIN jobs j ON j.id = ja.job_id
    ORDER BY c.id DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      jobId: c.job_id,
      stage: c.stage || "Applied",
      match: `${c.match_score || 85}%`,
      experience: c.experience,
      company: c.current_company,
      location: c.location,
    })));
  });
};

// Get Single Candidate Details
exports.getCandidateDetails = (req, res) => {
  const { id } = req.params;

  const candidateQuery = `
    SELECT c.*, ja.id AS application_id, ja.job_id, ja.stage, ja.match_score, j.title AS job_title, j.department_name
    FROM candidates c
    LEFT JOIN job_applications ja ON ja.candidate_id = c.id
    LEFT JOIN jobs j ON j.id = ja.job_id
    WHERE c.id = ?
  `;

  const interviewQuery = `
    SELECT i.*, e.name AS interviewer_name
    FROM interviews i
    JOIN job_applications ja ON ja.id = i.application_id
    LEFT JOIN employees e ON e.employee_id = i.interviewer_id
    WHERE ja.candidate_id = ?
  `;

  db.query(candidateQuery, [id], (err, candRows) => {
    if (err || candRows.length === 0) return res.status(404).json({ message: "Candidate not found" });

    db.query(interviewQuery, [id], (err, intRows) => {
      if (err) return res.status(500).json(err);

      const candidate = candRows[0];
      res.json({
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          stage: candidate.stage || "Applied",
          match: `${candidate.match_score || 85}%`,
          jobTitle: candidate.job_title || "Senior Engineer",
          experience: candidate.experience || "5 years",
          currentCompany: candidate.current_company || "TechCorp",
          location: candidate.location || "San Francisco, CA",
        },
        interviews: intRows,
      });
    });
  });
};

// Update Candidate Stage
exports.updateStage = (req, res) => {
  const { candidate_id, stage } = req.body;

  if (!candidate_id || !stage) {
    return res.status(400).json({ message: "candidate_id and stage are required" });
  }

  const query = `UPDATE job_applications SET stage = ? WHERE candidate_id = ?`;
  db.query(query, [stage, candidate_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: `Candidate stage updated to ${stage}` });
  });
};

// Schedule Interview
exports.scheduleInterview = (req, res) => {
  const { candidate_id, scheduled_at, round_name, interviewer_id } = req.body;

  db.query("SELECT id FROM job_applications WHERE candidate_id = ? LIMIT 1", [candidate_id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ message: "Application not found for candidate" });

    const appId = rows[0].id;
    const query = `
      INSERT INTO interviews (application_id, interviewer_id, scheduled_at, round_name, status)
      VALUES (?, ?, ?, ?, 'Scheduled')
    `;

    db.query(query, [appId, interviewer_id || req.user.employee_id, scheduled_at || new Date(), round_name || "Technical Round"], (err, result) => {
      if (err) return res.status(500).json(err);

      // Update stage to Interviewing
      db.query("UPDATE job_applications SET stage = 'Interviewing' WHERE id = ?", [appId], () => {});

      res.status(201).json({ message: "Interview scheduled successfully", id: result.insertId });
    });
  });
};
