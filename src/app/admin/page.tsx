"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Envelope,
  Briefcase,
  Users,
  TrendUp,
  Plus,
  Eye,
} from "@phosphor-icons/react";

interface DashboardData {
  kpis: {
    totalInquiries: number;
    activeProjects: number;
    totalClients: number;
    newThisMonth: number;
  };
  monthlyInquiries: { _id: { month: number; year: number }; count: number }[];
  projectStatuses: { _id: string; count: number }[];
  recentActivity: {
    _id: string;
    name: string;
    email: string;
    projectType: string;
    status: string;
    createdAt: string;
  }[];
}

const kpiCards = [
  { key: "totalInquiries", label: "Total Inquiries", icon: Envelope, color: "#FFE600" },
  { key: "activeProjects", label: "Active Projects", icon: Briefcase, color: "#00FF88" },
  { key: "totalClients", label: "Total Clients", icon: Users, color: "#7B2FBE" },
  { key: "newThisMonth", label: "New This Month", icon: TrendUp, color: "#0066FF" },
];

const statusColors: Record<string, string> = {
  new: "#FFE600",
  read: "#0066FF",
  contacted: "#7B2FBE",
  proposal_sent: "#00FF88",
  won: "#00FF88",
  lost: "#FF3B3B",
  archived: "#94A3B8",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white border-2 border-black animate-pulse" style={{ borderRadius: "2px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-center text-red font-bold">Failed to load dashboard</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/projects">
            <Button size="sm"><Plus size={14} className="mr-1" /> New Project</Button>
          </Link>
          <Link href="/admin/clients">
            <Button size="sm" variant="outline"><Plus size={14} className="mr-1" /> New Client</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.key}
            className="border-2 border-black p-5 shadow-brutal flex items-center gap-4"
            style={{ backgroundColor: card.color, borderRadius: "2px" }}
          >
            <card.icon size={32} weight="fill" />
            <div>
              <p className="text-2xl font-black font-space">
                {data.kpis[card.key as keyof typeof data.kpis]}
              </p>
              <p className="text-xs font-bold">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Inquiries Bar Chart */}
        <div className="border-2 border-black shadow-brutal bg-white p-5" style={{ borderRadius: "2px" }}>
          <h3 className="font-bold font-space mb-4">Monthly Inquiries (6 months)</h3>
          <div className="space-y-2">
            {data.monthlyInquiries.map((m) => {
              const maxCount = Math.max(...data.monthlyInquiries.map((x) => x.count), 1);
              const pct = (m.count / maxCount) * 100;
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return (
                <div key={`${m._id.year}-${m._id.month}`} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-10">{monthNames[m._id.month - 1]}</span>
                  <div className="flex-1 h-6 bg-cream border border-black/20" style={{ borderRadius: "2px" }}>
                    <div
                      className="h-full bg-yellow border-r-2 border-black transition-all"
                      style={{ width: `${pct}%`, borderRadius: "2px" }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">{m.count}</span>
                </div>
              );
            })}
            {data.monthlyInquiries.length === 0 && (
              <p className="text-sm text-black/50 text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="border-2 border-black shadow-brutal bg-white p-5" style={{ borderRadius: "2px" }}>
          <h3 className="font-bold font-space mb-4">Project Status Distribution</h3>
          <div className="space-y-3">
            {data.projectStatuses.map((s) => (
              <div key={s._id} className="flex items-center gap-3">
                <span className="text-xs font-bold w-24 capitalize">{s._id?.replace("_", " ")}</span>
                <div className="flex-1 h-6 bg-cream border border-black/20" style={{ borderRadius: "2px" }}>
                  <div
                    className="h-full bg-green border-r-2 border-black transition-all"
                    style={{
                      width: `${(s.count / Math.max(...data.projectStatuses.map((x) => x.count), 1)) * 100}%`,
                      borderRadius: "2px",
                    }}
                  />
                </div>
                <span className="text-xs font-bold w-8 text-right">{s.count}</span>
              </div>
            ))}
            {data.projectStatuses.length === 0 && (
              <p className="text-sm text-black/50 text-center py-4">No projects yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border-2 border-black shadow-brutal bg-white" style={{ borderRadius: "2px" }}>
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-cream">
          <h3 className="font-bold font-space">Recent Inquiries</h3>
          <Link href="/admin/inquiries">
            <Button size="sm" variant="outline"><Eye size={14} className="mr-1" /> View All</Button>
          </Link>
        </div>
        <div className="divide-y divide-black/10">
          {data.recentActivity.map((item) => (
            <Link
              key={item._id}
              href={`/admin/inquiries/${item._id}`}
              className="flex items-center justify-between p-4 hover:bg-cream/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow border border-black flex items-center justify-center text-xs font-bold" style={{ borderRadius: "2px" }}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-black/50">{item.email} - {item.projectType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="badge-brutal text-[10px]"
                  style={{ backgroundColor: statusColors[item.status] || "#FFE600" }}
                >
                  {item.status}
                </span>
                <span className="text-[10px] text-black/40">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
          {data.recentActivity.length === 0 && (
            <p className="text-sm text-black/50 text-center py-8">No inquiries yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
