import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT date, data FROM vibestr_snapshots ORDER BY date ASC"
    );

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

    // Append today's live price from DexScreener so the chart reaches the present
    try {
      const dexRes = await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196",
        { next: { revalidate: 60 } }
      );
      const dex = await dexRes.json();
      const pair = dex?.pairs?.[0];
      if (pair) {
        data.push({
          date: new Date().toISOString(),
          priceUsd: parseFloat(pair.priceUsd) || null,
          volume24h: parseFloat(pair.volume?.h24) || null,
          liquidityUsd: parseFloat(pair.liquidity?.usd) || null,
          marketCapUsd: parseFloat(pair.marketCap) || null,
          priceChange24h: pair.priceChange?.h24 ?? null,
          burnedAmount: null,
          holdingsCount: null,
        });
      }
    } catch {}

    if (!data.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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
