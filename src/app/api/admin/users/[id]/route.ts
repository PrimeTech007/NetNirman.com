export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models";
import { requireSuperAdmin } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    if (body.password) {
      body.passwordHash = await bcrypt.hash(body.password, 12);
      delete body.password;
    }

    const user = await User.findByIdAndUpdate(id, body, { new: true })
      .select("-passwordHash")
      .lean();
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role === "super_admin") {
      return NextResponse.json({ error: "Cannot delete super admin" }, { status: 403 });
    }
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
