require("dotenv").config();
const mysql = require("mysql2");

let pool = null;

try {
  const poolConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nexus_hr_db",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  };

  if (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  pool = mysql.createPool(poolConfig);
} catch (err) {
  console.error("[DB ERROR] MySQL Pool Init Failed:", err.message);
}

const db = {
  query: (sql, values, callback) => {
    if (typeof values === "function") {
      callback = values;
      values = [];
    }
    if (!pool) {
      const initErr = new Error("Database connection pool is not initialized.");
      console.error("[DB ERROR]", initErr.message);
      if (callback) callback(initErr, null);
      return;
    }
    try {
      pool.query(sql, values, (err, results, fields) => {
        if (err) {
          console.error("[DB ERROR] Query execution error:", err.message);
          if (callback) return callback(err, null);
        } else if (callback) {
          callback(null, results, fields);
        }
      });
    } catch (e) {
      console.error("[DB ERROR] Query exception:", e.message);
      if (callback) callback(e, null);
    }
  },
  promise: () => (pool ? pool.promise() : null),
  pool,
};

module.exports = db;