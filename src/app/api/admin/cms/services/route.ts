import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Service } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { serviceSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return NextResponse.json(services);
  } catch (err) {
    console.error("GET /api/admin/cms/services:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    const service = await Service.create(parsed.data);
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/cms/services:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
