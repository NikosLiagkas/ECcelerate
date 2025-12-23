

const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "softeng",
  password: "softeng",
  database: "softeng25",
  port: 5432,
});

module.exports = { pool };