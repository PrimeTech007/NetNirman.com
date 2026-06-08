export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const project = await Project.findById(id).populate("clientId", "name company email phone city").lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("GET /api/admin/projects/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const project = await Project.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("PUT /api/admin/projects/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const schema = z.object({
      status: z.enum(["planning", "in_progress", "review", "completed", "on_hold"]),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const project = await Project.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true }).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("PATCH /api/admin/projects/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
