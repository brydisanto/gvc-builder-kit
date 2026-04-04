import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

// GVC NFT contract — used to filter price_cache which contains multiple collections
export const GVC_CONTRACT = "0xb8ea78fcacef50d41375e44e6814ebba36bb33c4";
export const GVC_IMAGE_FILTER = `%${GVC_CONTRACT}%`;

export default pool;
