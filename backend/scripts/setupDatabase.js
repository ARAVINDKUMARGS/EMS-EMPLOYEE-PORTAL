require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
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

    console.log("MySQL connection successful. Executing schema.sql...");
    const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await connection.query(schemaSql);
    console.log("schema.sql executed successfully!");

    console.log("Executing seed.sql...");
    const seedPath = path.join(__dirname, "..", "..", "database", "seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf8");
    await connection.query(seedSql);
    console.log("seed.sql executed successfully!");

    await connection.end();
    console.log("nexus_hr_db setup complete!");
  } catch (err) {
    console.error("Database setup error:", err.message);
    process.exit(1);
  }
}

setupDatabase();
