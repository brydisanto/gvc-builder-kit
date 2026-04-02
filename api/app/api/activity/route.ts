import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT value FROM cache_entries WHERE key = 'community-activity' LIMIT 1"
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0].value);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
