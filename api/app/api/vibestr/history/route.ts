import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT date, data FROM vibestr_snapshots ORDER BY date ASC"
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = rows.map((r) => {
      const d = r.data;
      const poolData = d?.poolData || d || {};
      return {
        date: r.date,
        priceUsd: poolData.priceUsd ?? poolData.price_usd ?? null,
        volume24h: poolData.volume24h ?? poolData.volume_24h ?? null,
        liquidityUsd: poolData.liquidityUsd ?? poolData.liquidity_usd ?? null,
        marketCapUsd: poolData.marketCapUsd ?? poolData.market_cap_usd ?? null,
        priceChange24h: poolData.priceChange24h ?? poolData.price_change_24h ?? null,
        burnedAmount: d?.burnedAmount ?? d?.burned_amount ?? null,
        holdingsCount: d?.holdingsCount ?? d?.holdings_count ?? null,
      };
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
