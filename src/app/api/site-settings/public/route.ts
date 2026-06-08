import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SiteSettings } from "@/lib/models";

export const dynamic = 'force-dynamic';

const PUBLIC_KEYS = [
  "marquee_text",
  "stats",
  "contact_info",
  "social_links",
  "announcement_bar",
];

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const settings = await SiteSettings.find({
      key: { $in: PUBLIC_KEYS },
    }).lean();

    const result: Record<string, unknown> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/site-settings/public error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
