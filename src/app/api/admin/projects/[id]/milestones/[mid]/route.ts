import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id, mid } = await params;
    const body = await request.json();
    const schema = z.object({
      title: z.string().optional(),
      dueDate: z.string().optional(),
      completed: z.boolean().optional(),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const milestone = project.milestones.find((m) => m._id.toString() === mid);
    if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });

    if (parsed.data.title !== undefined) milestone.title = parsed.data.title;
    if (parsed.data.dueDate !== undefined) milestone.dueDate = new Date(parsed.data.dueDate);
    if (parsed.data.completed !== undefined) {
      milestone.completed = parsed.data.completed;
      milestone.completedAt = parsed.data.completed ? new Date() : null;
    }

    await project.save();
    return NextResponse.json(milestone);
  } catch (err) {
    console.error("PATCH milestone:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
