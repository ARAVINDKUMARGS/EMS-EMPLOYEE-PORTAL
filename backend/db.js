require("dotenv").config();
const mysql = require("mysql2");

let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nexus_hr_db",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,
  });
} catch (err) {
  console.error("MySQL Pool Init Warning:", err.message);
}

const db = {
  query: (sql, values, callback) => {
    if (typeof values === "function") {
      callback = values;
      values = [];
    }
    if (!pool) {
      if (callback) callback(new Error("Database pool is not initialized."));
      return;
    }
    try {
      pool.query(sql, values, (err, results, fields) => {
        if (err) {
          console.error("DB Query Error:", err.message);
          if (callback) return callback(err, null);
        }
        if (callback) callback(null, results, fields);
      });
    } catch (e) {
      console.error("DB Execution Exception:", e.message);
      if (callback) callback(e, null);
    }
  },
  pool,
};

module.exports = db;