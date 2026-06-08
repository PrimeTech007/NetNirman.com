export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Inquiry } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const projectType = searchParams.get("projectType");
    const budgetRange = searchParams.get("budgetRange");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (projectType) filter.projectType = projectType;
    if (budgetRange) filter.budgetRange = budgetRange;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) dateFilter.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.$lte = new Date(dateTo);
      filter.createdAt = dateFilter;
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      inquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
