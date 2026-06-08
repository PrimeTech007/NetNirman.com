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
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();

    const csvHeader = "ID,Name,Email,Phone,Project Type,Budget,Message,Source,Status,Date\n";
    const csvRows = inquiries
      .map((i) =>
        [
          i._id,
          `"${i.name}"`,
          i.email,
          i.phone,
          `"${i.projectType}"`,
          `"${i.budgetRange}"`,
          `"${(i.message || "").replace(/"/g, '""')}"`,
          i.source,
          i.status,
          new Date(i.createdAt).toISOString(),
        ].join(",")
      )
      .join("\n");

    const csv = csvHeader + csvRows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/inquiries/export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
