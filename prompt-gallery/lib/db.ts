import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export default pool;

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
      generations INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // Add generations column if table already exists without it
  await pool.query(`
    ALTER TABLE prompt_submissions ADD COLUMN IF NOT EXISTS generations INTEGER NOT NULL DEFAULT 0
  `).catch(() => {});

  // Categories table for custom categories
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prompt_categories (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      slug TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // Seed default categories if empty
  const { rows } = await pool.query("SELECT COUNT(*) as cnt FROM prompt_categories");
  if (parseInt(rows[0].cnt) === 0) {
    await pool.query(`
      INSERT INTO prompt_categories (slug, label) VALUES
        ('foundational', 'Foundational'),
        ('scene', 'Scenes'),
        ('profile', 'Profile Pics'),
        ('cinematic', 'Cinematic'),
        ('artistic', 'Artistic'),
        ('meme', 'Memes and Fun')
      ON CONFLICT DO NOTHING
    `);
  }
}
