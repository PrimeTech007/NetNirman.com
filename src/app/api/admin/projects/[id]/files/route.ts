export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const schema = z.object({ name: z.string().min(1), url: z.string().min(1) });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    project.files.push({ name: parsed.data.name, url: parsed.data.url } as never);
    await project.save();

    return NextResponse.json(project.files[project.files.length - 1], { status: 201 });
  } catch (err) {
    console.error("POST files:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
