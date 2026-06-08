"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Download, Eye, Funnel } from "@phosphor-icons/react";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  status: string;
  source: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "#FFE600",
  read: "#0066FF",
  contacted: "#7B2FBE",
  proposal_sent: "#00FF88",
  won: "#00FF88",
  lost: "#FF3B3B",
  archived: "#94A3B8",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchData();
  }, [statusFilter, pagination.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", pagination.page.toString());
      params.set("limit", "20");
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/inquiries?${params}`);
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((p) => ({ ...p, page: 1 }));
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-black font-space">Inquiries</h1>
        <a href="/api/admin/inquiries/export" target="_blank">
          <Button size="sm" variant="outline">
            <Download size={14} className="mr-1" /> Export CSV
          </Button>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-48">
          <Input
            placeholder="Search name/email/phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="w-40">
          <Select
            options={[
              { value: "", label: "All Status" },
              { value: "new", label: "New" },
              { value: "read", label: "Read" },
              { value: "contacted", label: "Contacted" },
              { value: "proposal_sent", label: "Proposal Sent" },
              { value: "won", label: "Won" },
              { value: "lost", label: "Lost" },
              { value: "archived", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={handleSearch}>
          <Funnel size={14} className="mr-1" /> Filter
        </Button>
      </div>

      {/* Table */}
      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Name</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Email</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">Phone</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">Type</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Budget</th>
              <th className="text-left p-3 font-bold">Status</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Date</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-8 text-center text-black/50">Loading...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-black/50">No inquiries found</td></tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq._id} className="border-b border-black/10 hover:bg-cream/30">
                  <td className="p-3 font-bold">{inq.name}</td>
                  <td className="p-3 hidden md:table-cell text-black/70">{inq.email}</td>
                  <td className="p-3 hidden lg:table-cell">{inq.phone}</td>
                  <td className="p-3 hidden lg:table-cell">{inq.projectType}</td>
                  <td className="p-3 hidden md:table-cell">{inq.budgetRange}</td>
                  <td className="p-3">
                    <span
                      className="badge-brutal text-[10px]"
                      style={{ backgroundColor: statusColors[inq.status] || "#FFE600" }}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-black/50">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/inquiries/${inq._id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye size={14} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Prev
          </Button>
          <span className="text-sm font-bold">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
