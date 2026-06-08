import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Inquiry, Project, Client } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();

    const [totalInquiries, activeProjects, totalClients, newThisMonth] = await Promise.all([
      Inquiry.countDocuments(),
      Project.countDocuments({ status: { $in: ["planning", "in_progress", "review"] } }),
      Client.countDocuments({ status: "active" }),
      Inquiry.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    // Monthly inquiries for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyInquiries = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Project status distribution
    const projectStatuses = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent activity (last 10 inquiries)
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email projectType status createdAt")
      .lean();

    return NextResponse.json({
      kpis: { totalInquiries, activeProjects, totalClients, newThisMonth },
      monthlyInquiries,
      projectStatuses,
      recentActivity: recentInquiries,
    });
  } catch (err) {
    console.error("GET /api/admin/dashboard:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
