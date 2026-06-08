import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Testimonial } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const testimonials = await Testimonial.find().sort({ order: 1 }).lean();
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    const t = await Testimonial.create(parsed.data);
    return NextResponse.json(t, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
