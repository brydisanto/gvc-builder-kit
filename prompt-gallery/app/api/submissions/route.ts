import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import pool, { ensureTable } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const prompt = formData.get("prompt") as string;
    const tokenId = formData.get("tokenId") as string;
    const xHandle = formData.get("xHandle") as string;
    const image = formData.get("image") as File;

    if (!title || !prompt || !tokenId || !image) {
      return NextResponse.json(
        { error: "Missing required fields: title, prompt, tokenId, image" },
        { status: 400 }
      );
    }

    // Upload image to Vercel Blob
    const blob = await put(`prompt-submissions/${Date.now()}-${image.name}`, image, {
      access: "public",
    });

    // Insert into database
    const { rows } = await pool.query(
      `INSERT INTO prompt_submissions (title, prompt, token_id, image_url, x_handle, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, title, status, created_at`,
      [title, prompt, tokenId, blob.url, xHandle || null]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e: any) {
    console.error("Submission error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureTable();
    const { rows } = await pool.query(
      `SELECT id, title, prompt, token_id, image_url, x_handle, status, category, generations, created_at
       FROM prompt_submissions
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
