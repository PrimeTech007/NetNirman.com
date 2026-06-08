import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { milestoneSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = milestoneSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    project.milestones.push({
      title: parsed.data.title,
      dueDate: new Date(parsed.data.dueDate),
      completed: false,
      completedAt: null,
    } as never);
    await project.save();

    return NextResponse.json(project.milestones[project.milestones.length - 1], { status: 201 });
  } catch (err) {
    console.error("POST milestones:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
