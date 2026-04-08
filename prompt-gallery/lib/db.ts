import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export default pool;

// Create the submissions table if it doesn't exist
export async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prompt_submissions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      token_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      x_handle TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      category TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}
