"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Pencil, Trash, Eye, EyeSlash } from "@phosphor-icons/react";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
  isVisible: boolean;
}

export default function ServicesCMSPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", description: "", isVisible: true });
  const { addToast } = useUIStore();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/cms/services");
      setServices(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, slug: s.slug, icon: s.icon, description: s.description, isVisible: s.isVisible });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "", description: "", isVisible: true });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name) return;
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      if (editing) {
        await fetch(`/api/admin/cms/services/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, slug }),
        });
      } else {
        await fetch("/api/admin/cms/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, slug }),
        });
      }
      addToast({ type: "success", message: "Saved!" });
      setShowModal(false);
      fetchServices();
    } catch { addToast({ type: "error", message: "Failed" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/cms/services/${id}`, { method: "DELETE" });
    addToast({ type: "success", message: "Deleted" });
    fetchServices();
  };

  const toggleVisibility = async (s: Service) => {
    await fetch(`/api/admin/cms/services/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !s.isVisible }),
    });
    fetchServices();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Services CMS</h1>
        <Button size="sm" onClick={openNew}><Plus size={14} className="mr-1" /> Add Service</Button>
      </div>

      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Order</th>
              <th className="text-left p-3 font-bold">Name</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Slug</th>
              <th className="text-left p-3 font-bold">Visible</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
            ) : services.map((s) => (
              <tr key={s._id} className="border-b border-black/10">
                <td className="p-3 font-bold">{s.order}</td>
                <td className="p-3 font-bold">{s.name}</td>
                <td className="p-3 hidden md:table-cell text-black/50">{s.slug}</td>
                <td className="p-3">
                  <button onClick={() => toggleVisibility(s)} className="cursor-pointer">
                    {s.isVisible ? <Eye size={18} className="text-green" /> : <EyeSlash size={18} className="text-red" />}
                  </button>
                </td>
                <td className="p-3 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s._id)}><Trash size={14} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Service" : "New Service"}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
          <Input label="Icon (Phosphor name)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
          <Input label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm((p) => ({ ...p, isVisible: e.target.checked }))} />
            <span className="text-sm font-bold">Visible on website</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
