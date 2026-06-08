import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SiteSettings } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const plans = await SiteSettings.findOne({ key: "pricing_plans" }).lean();
    const faq = await SiteSettings.findOne({ key: "faq" }).lean();

    return NextResponse.json({
      plans: plans?.value || [],
      faq: faq?.value || [],
    });
  } catch (error) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
