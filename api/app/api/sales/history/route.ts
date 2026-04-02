import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    let limit = 100;
    if (limitParam) {
      limit = Math.min(Math.max(1, parseInt(limitParam, 10)), 1000);
    }
    const { rows } = await pool.query(
      "SELECT tx_hash, price_eth, price_usd, payment_symbol, image_url, created_at FROM price_cache ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = rows.map((r) => ({
      txHash: r.tx_hash,
      priceEth: r.price_eth,
      priceUsd: r.price_usd,
      paymentSymbol: r.payment_symbol,
      imageUrl: r.image_url,
      createdAt: r.created_at,
    }));
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
