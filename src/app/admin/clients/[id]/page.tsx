"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ArrowLeft } from "@phosphor-icons/react";

interface ClientDetail {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  industry: string;
  status: string;
  gstNumber: string;
  notes: string;
  projects: { _id: string; name: string; status: string; value: number }[];
  totalValue: number;
  amountReceived: number;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetch(`/api/admin/clients/${params.id}`)
      .then((r) => r.json())
      .then(setClient)
      .catch(console.error);
  }, [params.id]);

  if (!client) return <div className="text-center py-8">Loading...</div>;

  const tabs = ["overview", "projects", "financial"];

  return (
    <div className="space-y-4 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:underline">
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-black font-space">{client.name}</h1>
        <p className="text-sm text-black/60">{client.company} | {client.email}</p>
      </div>

      <div className="flex gap-1 border-b-2 border-black">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold capitalize cursor-pointer border-2 border-b-0 ${tab === t ? "bg-yellow border-black" : "bg-white border-transparent"}`} style={{ borderRadius: "2px 2px 0 0" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="border-2 border-black shadow-brutal bg-white p-6" style={{ borderRadius: "2px" }}>
        {tab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="text-xs font-bold text-black/50">Phone</span><p className="font-bold text-sm">{client.phone || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">WhatsApp</span><p className="font-bold text-sm">{client.whatsapp || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">City</span><p className="font-bold text-sm">{client.city || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">State</span><p className="font-bold text-sm">{client.state || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">Industry</span><p className="font-bold text-sm">{client.industry || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">GST Number</span><p className="font-bold text-sm">{client.gstNumber || "-"}</p></div>
            <div className="col-span-2 md:col-span-3"><span className="text-xs font-bold text-black/50">Notes</span><p className="text-sm mt-1">{client.notes || "No notes"}</p></div>
          </div>
        )}

        {tab === "projects" && (
          <div className="space-y-2">
            {client.projects?.length === 0 ? (
              <p className="text-sm text-black/50 text-center">No projects</p>
            ) : (
              client.projects.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 border border-black/10">
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <Badge color={p.status === "completed" ? "#00FF88" : "#0066FF"}>{p.status?.replace("_", " ")}</Badge>
                  </div>
                  <p className="font-bold text-sm">{"\u20B9"}{(p.value || 0).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "financial" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="border-2 border-black p-4 bg-cream text-center" style={{ borderRadius: "2px" }}>
              <p className="text-2xl font-black font-space">{"\u20B9"}{(client.totalValue || 0).toLocaleString()}</p>
              <p className="text-xs text-black/60 mt-1">Total Value</p>
            </div>
            <div className="border-2 border-black p-4 bg-green text-center" style={{ borderRadius: "2px" }}>
              <p className="text-2xl font-black font-space">{"\u20B9"}{(client.amountReceived || 0).toLocaleString()}</p>
              <p className="text-xs mt-1">Received</p>
            </div>
            <div className="border-2 border-black p-4 bg-red text-white text-center" style={{ borderRadius: "2px" }}>
              <p className="text-2xl font-black font-space">{"\u20B9"}{((client.totalValue || 0) - (client.amountReceived || 0)).toLocaleString()}</p>
              <p className="text-xs mt-1">Pending</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
