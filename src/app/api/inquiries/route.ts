import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Inquiry } from "@/lib/models";
import { inquirySchema } from "@/lib/validations";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 per hour per IP
    const ip = getClientIP(request);
    const rl = rateLimit(`inquiry:${ip}`, { windowMs: 3600000, maxRequests: 5 });

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create(parsed.data);

    return NextResponse.json(
      { message: "Inquiry submitted successfully", id: inquiry._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
