export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Inquiry, Client, Project } from "@/lib/models";
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

    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Auto-mark as read
    if (inquiry.status === "new") {
      await Inquiry.findByIdAndUpdate(id, { status: "read" });
      inquiry.status = "read";
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("GET /api/admin/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  status: z.enum(["new", "read", "contacted", "proposal_sent", "won", "lost", "archived"]).optional(),
  note: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const update: Record<string, unknown> = {};
    if (parsed.data.status) update.status = parsed.data.status;
    if (parsed.data.note) {
      update.$push = {
        notes: {
          content: parsed.data.note,
          createdBy: "admin",
          createdAt: new Date(),
        },
      };
    }

    const inquiry = await Inquiry.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("PATCH /api/admin/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Create client from inquiry
    const client = await Client.create({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      source: "inquiry",
      inquiryRef: inquiry._id,
      status: "active",
    });

    // Create project from inquiry
    const slug = inquiry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const project = await Project.create({
      name: `${inquiry.name} - Project`,
      slug,
      clientId: client._id,
      type: [inquiry.projectType],
      status: "planning",
    });

    // Update inquiry
    inquiry.convertedTo = client._id;
    inquiry.status = "won";
    await inquiry.save();

    return NextResponse.json({
      message: "Converted to client and project",
      client: { id: client._id },
      project: { id: project._id },
    });
  } catch (error) {
    console.error("POST /api/admin/inquiries/[id]/convert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
