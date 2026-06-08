import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Client, Project } from "@/lib/models";
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
    await connectDB();
    const client = await Client.findById(id).lean();
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const projects = await Project.find({ clientId: id }).lean();
    const totalValue = projects.reduce((sum, p) => sum + (p.value || 0), 0);
    const amountReceived = projects.reduce((sum, p) => sum + (p.amountReceived || 0), 0);

    return NextResponse.json({ ...client, projects, totalValue, amountReceived });
  } catch (err) {
    console.error("GET /api/admin/clients/[id]:", err);
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
    await connectDB();
    const client = await Client.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err) {
    console.error("PUT /api/admin/clients/[id]:", err);
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
    const schema = z.object({ status: z.enum(["active", "inactive"]) });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    await connectDB();
    const client = await Client.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true }).lean();
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err) {
    console.error("PATCH /api/admin/clients/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
