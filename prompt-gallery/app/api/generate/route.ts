import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";

// POST - increment generation count for a prompt
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const { promptId } = await request.json();
    if (!promptId) {
      return NextResponse.json({ error: "Missing promptId" }, { status: 400 });
    }

    // Only increment for community prompts (in the database)
    await pool.query(
      "UPDATE prompt_submissions SET generations = generations + 1 WHERE id = $1",
      [promptId]
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
