import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address.toLowerCase();

    const [tagResult, ensResult] = await Promise.all([
      pool.query("SELECT name FROM account_tags WHERE address = $1", [address]),
      pool.query(
        "SELECT value FROM cache_entries WHERE key = 'ens-' || $1 LIMIT 1",
        [address]
      ),
    ]);

    const tag = tagResult.rows[0]?.name ?? null;
    const ensData = ensResult.rows[0]?.value ?? {};
    const ensName = ensData.ensName ?? ensData.ens ?? null;
    const twitter = ensData.twitter ?? ensData.twitterHandle ?? null;

    return NextResponse.json({ address, ensName, twitter, tag });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
