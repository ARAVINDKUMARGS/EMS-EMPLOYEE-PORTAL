require("dotenv").config();
const mysql = require("mysql2");

let pool = null;

try {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "ems_db";
  const port = Number(process.env.DB_PORT) || 3306;

  if (!process.env.DB_HOST && (process.env.VERCEL || process.env.NODE_ENV === "production")) {
    console.error("[CRITICAL DB CONFIG ERROR] DB_HOST environment variable is missing in Vercel settings! Localhost connection will fail in Vercel serverless environment.");
  }

  const poolConfig = {
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
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
      const initErr = new Error("Database connection pool is not initialized. Check Vercel DB_* environment variables.");
      console.error("[DB ERROR]", initErr.message);
      if (callback) callback(initErr, null);
      return;
    }
    try {
      pool.query(sql, values, (err, results, fields) => {
        if (err) {
          console.error("[DB ERROR] Query execution error:", { error: err.message, code: err.code });
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