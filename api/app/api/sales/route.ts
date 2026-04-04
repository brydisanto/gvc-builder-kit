import { NextRequest, NextResponse } from "next/server";
import pool, { GVC_IMAGE_FILTER } from "@/lib/db";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Try cache first
    const cached = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'events-recent' LIMIT 1"
    );
    if (cached.rows.length) {
      let data = cached.rows[0].value;
      const limit = request.nextUrl.searchParams.get("limit");
      if (limit && Array.isArray(data)) {
        data = data.slice(0, parseInt(limit, 10));
      }
      return NextResponse.json(data);
    }

    // Compute from price_cache — GVC only
    const limitParam = request.nextUrl.searchParams.get("limit");
    let limit = 20;
    if (limitParam) {
      limit = Math.min(Math.max(1, parseInt(limitParam, 10)), 100);
    }

    const { rows } = await pool.query(
      `SELECT tx_hash, price_eth, price_usd, payment_symbol, image_url, created_at
       FROM price_cache
       WHERE image_url LIKE $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [GVC_IMAGE_FILTER, limit]
    );

    const data = rows.map((r) => ({
      txHash: r.tx_hash,
      priceEth: parseFloat(r.price_eth) || 0,
      priceUsd: r.price_usd ? parseFloat(r.price_usd) : null,
      paymentSymbol: r.payment_symbol,
      imageUrl: r.image_url,
      timestamp: r.created_at,
    }));

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
