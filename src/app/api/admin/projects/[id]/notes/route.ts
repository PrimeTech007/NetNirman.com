import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { noteSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    project.notes.push({
      content: parsed.data.content,
      createdBy: session?.user?.name || "admin",
      createdAt: new Date(),
    } as never);
    await project.save();

    return NextResponse.json(project.notes[project.notes.length - 1], { status: 201 });
  } catch (err) {
    console.error("POST notes:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
