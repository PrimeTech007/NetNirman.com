import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Service } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";

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
    const service = await Service.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(service);
  } catch (err) {
    console.error("PUT service:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE service:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
