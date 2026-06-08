export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SiteSettings } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const settings = await SiteSettings.find().lean();
    const result: Record<string, unknown> = {};
    settings.forEach((s) => { result[s.key] = { value: s.value, description: s.description }; });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    // body should be { key, value, description? }
    const { key, value, description } = body;
    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value required" }, { status: 400 });
    }

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { value, description: description || "", updatedBy: "admin", updatedAt: new Date() },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(setting);
  } catch (err) {
    console.error("PUT /api/admin/site-settings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
