import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const projects = await Project.find({ isPublic: true })
      .select("name slug type thumbnailUrl isFeatured createdAt description techStack")
      .populate("clientId", "name company")
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
