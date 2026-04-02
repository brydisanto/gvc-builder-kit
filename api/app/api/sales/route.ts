import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { rows } = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'events-recent' LIMIT 1"
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    let data = rows[0].value;
    const limit = request.nextUrl.searchParams.get("limit");
    if (limit && Array.isArray(data)) {
      data = data.slice(0, parseInt(limit, 10));
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
