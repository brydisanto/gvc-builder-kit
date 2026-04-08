import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";

// GET all categories
export async function GET() {
  try {
    await ensureTable();
    const { rows } = await pool.query(
      "SELECT id, slug, label FROM prompt_categories ORDER BY created_at ASC"
    );
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST - create a new category
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const { label } = await request.json();
    if (!label) {
      return NextResponse.json({ error: "Missing label" }, { status: 400 });
    }
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { rows } = await pool.query(
      "INSERT INTO prompt_categories (slug, label) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING RETURNING *",
      [slug, label]
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE - remove a category
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await pool.query("DELETE FROM prompt_categories WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
