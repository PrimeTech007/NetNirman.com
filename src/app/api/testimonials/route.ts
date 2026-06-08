import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Testimonial } from "@/lib/models";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const testimonials = await Testimonial.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
