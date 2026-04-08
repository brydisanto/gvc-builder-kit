import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";

// GET all submissions (pending first, then approved, then rejected)
export async function GET() {
  try {
    await ensureTable();

    const { rows } = await pool.query(
      `SELECT id, title, prompt, token_id, image_url, x_handle, status, category, created_at, updated_at
       FROM prompt_submissions
       ORDER BY
         CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 WHEN 'rejected' THEN 2 END,
         created_at DESC`
    );

    const stats = {
      total: rows.length,
      pending: rows.filter((r: any) => r.status === "pending").length,
      approved: rows.filter((r: any) => r.status === "approved").length,
      rejected: rows.filter((r: any) => r.status === "rejected").length,
    };

    return NextResponse.json({ stats, submissions: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH - update submission status or fields
export async function PATCH(request: NextRequest) {
  try {
    await ensureTable();

    const body = await request.json();
    const { id, status, category } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (status) {
      updates.push(`status = $${idx++}`);
      values.push(status);
    }
    if (category !== undefined) {
      updates.push(`category = $${idx++}`);
      values.push(category);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE prompt_submissions SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE - remove a submission
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await pool.query("DELETE FROM prompt_submissions WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
