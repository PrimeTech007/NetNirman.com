export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { userSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

    const user = new User({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: parsed.data.password || "changeme123",
      role: parsed.data.role,
      isActive: parsed.data.isActive,
    });
    await user.save();

    const result = user.toObject() as unknown as Record<string, unknown>;
    delete result.passwordHash;
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
