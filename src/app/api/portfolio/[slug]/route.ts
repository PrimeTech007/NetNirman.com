import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const project = await Project.findOne({ slug, isPublic: true })
      .populate("clientId", "name company logoUrl")
      .lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/portfolio/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
