import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";

// POST - increment generation count for any prompt
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const { promptId, isBuiltIn } = await request.json();
    if (!promptId) {
      return NextResponse.json({ error: "Missing promptId" }, { status: 400 });
    }

    if (isBuiltIn) {
      // Built-in prompts use the prompt_generations table
      await pool.query(
        `INSERT INTO prompt_generations (prompt_id, count) VALUES ($1, 1)
         ON CONFLICT (prompt_id) DO UPDATE SET count = prompt_generations.count + 1`,
        [promptId]
      );
    } else {
      // Community prompts increment on their row
      await pool.query(
        "UPDATE prompt_submissions SET generations = generations + 1 WHERE id = $1",
        [promptId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET - get generation counts for built-in prompts
export async function GET() {
  try {
    await ensureTable();
    const { rows } = await pool.query("SELECT prompt_id, count FROM prompt_generations");
    const counts: Record<string, number> = {};
    rows.forEach((r: any) => { counts[r.prompt_id] = parseInt(r.count); });
    return NextResponse.json(counts);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
