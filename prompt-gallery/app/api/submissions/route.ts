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
    const moreDetails = formData.get("moreDetails") as string;

    if (!title || !prompt || !tokenId || !image) {
      return NextResponse.json(
        { error: "Missing required fields: title, prompt, tokenId, image" },
        { status: 400 }
      );
    }

    // Upload main image to Vercel Blob
    const blob = await put(`prompt-submissions/${Date.now()}-${image.name}`, image, {
      access: "public",
    });

    // Upload reference images if any
    const refUrls: string[] = [];
    for (let i = 0; i < 10; i++) {
      const refFile = formData.get(`refImage${i}`) as File | null;
      if (!refFile) break;
      const refBlob = await put(`prompt-submissions/ref-${Date.now()}-${refFile.name}`, refFile, {
        access: "public",
      });
      refUrls.push(refBlob.url);
    }

    // Insert into database
    const { rows } = await pool.query(
      `INSERT INTO prompt_submissions (title, prompt, token_id, image_url, x_handle, more_details, ref_images, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING id, title, status, created_at`,
      [title, prompt, tokenId, blob.url, xHandle || null, moreDetails || null, refUrls.length > 0 ? JSON.stringify(refUrls) : null]
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
