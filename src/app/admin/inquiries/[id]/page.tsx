"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { useUIStore } from "@/lib/stores/useUIStore";
import { ArrowLeft, UserPlus, Briefcase } from "@phosphor-icons/react";

interface InquiryDetail {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
  source: string;
  status: string;
  notes: { content: string; createdBy: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useUIStore();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/inquiries/${params.id}`)
      .then((r) => r.json())
      .then(setInquiry)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/admin/inquiries/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setInquiry(data);
      addToast({ type: "success", message: "Status updated" });
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    const res = await fetch(`/api/admin/inquiries/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      const data = await res.json();
      setInquiry(data);
      setNote("");
      addToast({ type: "success", message: "Note added" });
    }
  };

  const convertToClient = async () => {
    setConverting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        addToast({ type: "success", message: "Converted to client & project!" });
        router.refresh();
      }
    } catch {
      addToast({ type: "error", message: "Conversion failed" });
    } finally {
      setConverting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!inquiry) return <div className="text-center py-8 text-red font-bold">Inquiry not found</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:underline">
        <ArrowLeft size={16} /> Back to Inquiries
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-space">{inquiry.name}</h1>
          <p className="text-sm text-black/60">{inquiry.email} | {inquiry.phone}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={convertToClient} disabled={converting}>
            <UserPlus size={14} className="mr-1" /> Convert to Client
          </Button>
          <Button size="sm" variant="outline" onClick={convertToClient} disabled={converting}>
            <Briefcase size={14} className="mr-1" /> Create Project
          </Button>
        </div>
      </div>

      {/* Details Card */}
      <div className="border-2 border-black shadow-brutal bg-white p-6" style={{ borderRadius: "2px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-black/50">Project Type</span>
            <p className="font-bold">{inquiry.projectType}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-black/50">Budget Range</span>
            <p className="font-bold">{inquiry.budgetRange}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-black/50">Source</span>
            <p className="font-bold">{inquiry.source}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-black/50">Date</span>
            <p className="font-bold">{new Date(inquiry.createdAt).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs font-bold text-black/50">Status</span>
            <div className="mt-1">
              <Select
                value={inquiry.status}
                onChange={(e) => updateStatus(e.target.value)}
                options={[
                  { value: "new", label: "New" },
                  { value: "read", label: "Read" },
                  { value: "contacted", label: "Contacted" },
                  { value: "proposal_sent", label: "Proposal Sent" },
                  { value: "won", label: "Won" },
                  { value: "lost", label: "Lost" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs font-bold text-black/50">Message</span>
            <p className="mt-1 text-sm">{inquiry.message}</p>
          </div>
        </div>
      </div>

      {/* Notes Timeline */}
      <div className="border-2 border-black shadow-brutal bg-white" style={{ borderRadius: "2px" }}>
        <div className="p-4 border-b-2 border-black bg-cream">
          <h3 className="font-bold font-space">Internal Notes</h3>
        </div>
        <div className="p-4 space-y-4">
          {inquiry.notes?.map((n, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-yellow border border-black flex items-center justify-center text-xs font-bold shrink-0" style={{ borderRadius: "2px" }}>
                {n.createdBy.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{n.createdBy}</span>
                  <span className="text-xs text-black/40">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm mt-1">{n.content}</p>
              </div>
            </div>
          ))}
          {(!inquiry.notes || inquiry.notes.length === 0) && (
            <p className="text-sm text-black/50 text-center">No notes yet</p>
          )}
        </div>
        <div className="p-4 border-t-2 border-black flex gap-2">
          <input
            className="input-brutal flex-1"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <Button size="sm" onClick={addNote}>Add</Button>
        </div>
      </div>
    </div>
  );
}
