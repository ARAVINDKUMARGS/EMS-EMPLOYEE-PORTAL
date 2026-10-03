const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");
const fs = require("fs");

async function setupDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "Root@12345";
  const port = Number(process.env.DB_PORT) || 3306;

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true,
    });

    console.log("MySQL connection successful. Executing backend/schema.sql...");
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await connection.query(schemaSql);
    console.log("backend/schema.sql executed successfully!");

    await connection.end();
    console.log("Database setup complete!");
  } catch (err) {
    console.error("Database setup error:", err.message);
    process.exit(1);
  }
}

setupDatabase();
