import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Try cache first — Seymour populates this
    const cached = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'community-holders-v2' LIMIT 1"
    );
    if (cached.rows.length) {
      const data = cached.rows[0].value;
      const limit = request.nextUrl.searchParams.get("limit");
      if (limit && data.holders) {
        data.holders = data.holders.slice(0, parseInt(limit, 10));
      }
      return NextResponse.json(data);
    }

    // No holder data available in price_cache — return helpful message
    return NextResponse.json(
      {
        stats: {
          totalHolders: null,
          diamondHandsPercent: null,
          note: "Holder data is temporarily unavailable. Use the GVC API badge-leaderboard endpoint for wallet-level data.",
        },
        holders: [],
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
