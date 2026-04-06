import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    // Try cache first
    const cached = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'community-vibestr-activity' LIMIT 1"
    );
    if (cached.rows.length) {
      return NextResponse.json(cached.rows[0].value);
    }

    // Fetch live from DexScreener
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196",
      { next: { revalidate: 60 } }
    );
    const dex = await res.json();
    const pair = dex?.pairs?.[0];

    if (!pair) {
      return NextResponse.json({ error: "VIBESTR data unavailable" }, { status: 502 });
    }

    const data = {
      priceUsd: parseFloat(pair.priceUsd) || 0,
      priceChange24h: pair.priceChange?.h24 ?? 0,
      volume24h: parseFloat(pair.volume?.h24) || 0,
      liquidity: parseFloat(pair.liquidity?.usd) || 0,
      marketCap: parseFloat(pair.marketCap) || 0,
      pairAddress: pair.pairAddress,
      dexId: pair.dexId,
      url: pair.url,
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
