import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    // Try cache first
    const cached = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'trader-analysis-30' LIMIT 1"
    );
    if (cached.rows.length) {
      return NextResponse.json(cached.rows[0].value);
    }

    // Compute basic trade stats from price_cache
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) as total_trades,
        AVG(price_eth) as avg_price,
        MIN(price_eth) FILTER (WHERE price_eth > 0) as min_price,
        MAX(price_eth) as max_price,
        SUM(price_eth) as total_volume
      FROM price_cache
      WHERE created_at > NOW() - INTERVAL '30 days'
        AND price_eth > 0
    `);

    const stats = rows[0];

    return NextResponse.json(
      {
        totalTrades30d: parseInt(stats.total_trades) || 0,
        avgPrice: parseFloat(stats.avg_price) || 0,
        minPrice: parseFloat(stats.min_price) || 0,
        maxPrice: parseFloat(stats.max_price) || 0,
        totalVolume: parseFloat(stats.total_volume) || 0,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
