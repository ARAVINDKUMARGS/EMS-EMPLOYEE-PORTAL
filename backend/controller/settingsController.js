const db = require("../db");

// Get settings
exports.getSettings = (req, res) => {
  db.query("SELECT * FROM system_settings", (err, rows) => {
    if (err) return res.status(500).json(err);
    const settings = {};
    rows.forEach((r) => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  });
};

// Save settings
exports.saveSettings = (req, res) => {
  const settings = req.body;
  const queries = Object.entries(settings).map(([key, val]) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [key, String(val)],
        (err) => (err ? reject(err) : resolve())
      );
    });
  });

  Promise.all(queries)
    .then(() => res.json({ message: "System settings saved successfully" }))
    .catch((err) => res.status(500).json(err));
};
