"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Eye } from "@phosphor-icons/react";

interface Client {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  projectCount: number;
  totalValue: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", company: "", phone: "" });
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    if (!newClient.name || !newClient.email) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        addToast({ type: "success", message: "Client created!" });
        setShowAddModal(false);
        setNewClient({ name: "", email: "", company: "", phone: "" });
        fetchClients();
      }
    } catch {
      addToast({ type: "error", message: "Failed to create client" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Clients</h1>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} className="mr-1" /> Add Client
        </Button>
      </div>

      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Name</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Company</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Email</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">Phone</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">City</th>
              <th className="text-left p-3 font-bold">Projects</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Total Value</th>
              <th className="text-left p-3 font-bold">Status</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="p-8 text-center text-black/50">Loading...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={9} className="p-8 text-center text-black/50">No clients yet</td></tr>
            ) : (
              clients.map((c) => (
                <tr key={c._id} className="border-b border-black/10 hover:bg-cream/30">
                  <td className="p-3 font-bold">{c.name}</td>
                  <td className="p-3 hidden md:table-cell">{c.company || "-"}</td>
                  <td className="p-3 hidden md:table-cell text-black/70">{c.email}</td>
                  <td className="p-3 hidden lg:table-cell">{c.phone || "-"}</td>
                  <td className="p-3 hidden lg:table-cell">{c.city || "-"}</td>
                  <td className="p-3">{c.projectCount || 0}</td>
                  <td className="p-3 hidden md:table-cell">{"\u20B9"}{(c.totalValue || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className="badge-brutal text-[10px]" style={{ backgroundColor: c.status === "active" ? "#00FF88" : "#94A3B8" }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/clients/${c._id}`}>
                      <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Client">
        <div className="space-y-4">
          <Input label="Name *" value={newClient.name} onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email *" type="email" value={newClient.email} onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Company" value={newClient.company} onChange={(e) => setNewClient((p) => ({ ...p, company: e.target.value }))} />
          <Input label="Phone" value={newClient.phone} onChange={(e) => setNewClient((p) => ({ ...p, phone: e.target.value }))} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={addClient}>Create Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
