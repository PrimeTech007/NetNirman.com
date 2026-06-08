"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Pencil, Trash, Eye, EyeSlash, Star } from "@phosphor-icons/react";

interface Testimonial {
  _id: string;
  clientName: string;
  company: string;
  photoUrl: string;
  quote: string;
  rating: number;
  isVisible: boolean;
  order: number;
}

export default function TestimonialsCMSPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    clientName: "",
    company: "",
    photoUrl: "",
    quote: "",
    rating: 5,
    isVisible: true,
  });
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/cms/testimonials");
      setTestimonials(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      company: t.company,
      photoUrl: t.photoUrl,
      quote: t.quote,
      rating: t.rating,
      isVisible: t.isVisible,
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ clientName: "", company: "", photoUrl: "", quote: "", rating: 5, isVisible: true });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.clientName || !form.quote) return;
    try {
      if (editing) {
        await fetch(`/api/admin/cms/testimonials/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/cms/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      addToast({ type: "success", message: "Saved!" });
      setShowModal(false);
      fetchTestimonials();
    } catch {
      addToast({ type: "error", message: "Failed" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/cms/testimonials/${id}`, { method: "DELETE" });
    addToast({ type: "success", message: "Deleted" });
    fetchTestimonials();
  };

  const toggleVisibility = async (t: Testimonial) => {
    await fetch(`/api/admin/cms/testimonials/${t._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !t.isVisible }),
    });
    fetchTestimonials();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Testimonials CMS</h1>
        <Button size="sm" onClick={openNew}>
          <Plus size={14} className="mr-1" /> Add Testimonial
        </Button>
      </div>

      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Order</th>
              <th className="text-left p-3 font-bold">Client</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Company</th>
              <th className="text-left p-3 font-bold">Rating</th>
              <th className="text-left p-3 font-bold">Visible</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">Loading...</td>
              </tr>
            ) : testimonials.map((t) => (
              <tr key={t._id} className="border-b border-black/10">
                <td className="p-3 font-bold">{t.order}</td>
                <td className="p-3 font-bold">{t.clientName}</td>
                <td className="p-3 hidden md:table-cell text-black/50">{t.company}</td>
                <td className="p-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        weight={i < t.rating ? "fill" : "regular"}
                        className={i < t.rating ? "text-yellow" : "text-black/20"}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <button onClick={() => toggleVisibility(t)} className="cursor-pointer">
                    {t.isVisible ? (
                      <Eye size={18} className="text-green" />
                    ) : (
                      <EyeSlash size={18} className="text-red" />
                    )}
                  </button>
                </td>
                <td className="p-3 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(t._id)}>
                    <Trash size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Testimonial" : "New Testimonial"}
      >
        <div className="space-y-4">
          <Input
            label="Client Name"
            value={form.clientName}
            onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
          />
          <Input
            label="Photo URL"
            value={form.photoUrl}
            onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))}
          />
          <Textarea
            label="Quote"
            value={form.quote}
            onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
            rows={4}
          />
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, rating: n }))}
                  className="cursor-pointer"
                >
                  <Star
                    size={24}
                    weight={n <= form.rating ? "fill" : "regular"}
                    className={n <= form.rating ? "text-yellow" : "text-black/20"}
                  />
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => setForm((p) => ({ ...p, isVisible: e.target.checked }))}
            />
            <span className="text-sm font-bold">Visible on website</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
