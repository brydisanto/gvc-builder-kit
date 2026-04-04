import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    // Try cache first
    const cached = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'collection-stats' LIMIT 1"
    );
    if (cached.rows.length) {
      return NextResponse.json(cached.rows[0].value);
    }

    // Compute from price_cache
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) as total_sales,
        MIN(price_eth) FILTER (WHERE created_at > NOW() - INTERVAL '7 days' AND price_eth > 0.1) as floor_price,
        SUM(price_eth) FILTER (WHERE created_at > NOW() - INTERVAL '1 day') as volume_24h,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day') as sales_24h,
        AVG(price_eth) FILTER (WHERE created_at > NOW() - INTERVAL '7 days' AND price_eth > 0) as avg_price_7d
      FROM price_cache
      WHERE price_eth > 0
    `);

    const stats = rows[0];

    // Get ETH price for USD conversion
    let ethPrice = 0;
    try {
      const ethRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        { next: { revalidate: 60 } }
      );
      const ethData = await ethRes.json();
      ethPrice = ethData?.ethereum?.usd ?? 0;
    } catch {}

    const floorPrice = parseFloat(stats.floor_price) || 0;
    const volume24h = parseFloat(stats.volume_24h) || 0;

    const data = {
      floorPrice,
      floorPriceUsd: floorPrice * ethPrice,
      marketCap: floorPrice * 6969,
      marketCapUsd: floorPrice * 6969 * ethPrice,
      numOwners: 1500, // Approximate — no holder data in price_cache
      totalSales: parseInt(stats.total_sales) || 0,
      volume24h,
      volume24hUsd: volume24h * ethPrice,
      sales24h: parseInt(stats.sales_24h) || 0,
      avgPrice7d: parseFloat(stats.avg_price_7d) || 0,
      ethPrice,
    };

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
