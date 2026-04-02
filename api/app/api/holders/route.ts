import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { rows } = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'community-holders-v2' LIMIT 1"
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = rows[0].value;
    const limit = request.nextUrl.searchParams.get("limit");
    if (limit && data.holders) {
      data.holders = data.holders.slice(0, parseInt(limit, 10));
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
