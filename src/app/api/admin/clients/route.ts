import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Client, Project } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { clientSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Client.countDocuments(filter);
    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get project counts and total values for each client
    const clientIds = clients.map((c) => c._id);
    const projectStats = await Project.aggregate([
      { $match: { clientId: { $in: clientIds } } },
      {
        $group: {
          _id: "$clientId",
          projectCount: { $sum: 1 },
          totalValue: { $sum: "$value" },
        },
      },
    ]);

    const statsMap = new Map(projectStats.map((s) => [s._id.toString(), s]));

    const enriched = clients.map((c) => ({
      ...c,
      projectCount: statsMap.get(c._id.toString())?.projectCount || 0,
      totalValue: statsMap.get(c._id.toString())?.totalValue || 0,
    }));

    return NextResponse.json({
      clients: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /api/admin/clients:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await connectDB();
    const client = await Client.create(parsed.data);
    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/clients:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
