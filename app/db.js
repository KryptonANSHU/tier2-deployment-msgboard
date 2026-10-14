const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Postgres may not accept connections right away, so retry before giving up.
async function initDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT now()
        )`);
      console.log('Database ready');
      return;
    } catch (err) {
      console.log(`DB not ready (attempt ${i}/${retries}): ${err.message}`);
      await sleep(3000);
    }
  }
  throw new Error('Could not connect to the database');
}

async function getMessages() {
  const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

async function addMessage(text) {
  const { rows } = await pool.query(
    'INSERT INTO messages (message) VALUES ($1) RETURNING *',
    [text]
  );
  return rows[0];
}

module.exports = { initDb, getMessages, addMessage };
