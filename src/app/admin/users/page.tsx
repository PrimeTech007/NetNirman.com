"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Pencil, Trash, ShieldCheck, Shield, User as UserIcon } from "@phosphor-icons/react";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "viewer";
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" as string, isActive: true });
  const { addToast } = useUIStore();

  const currentUserEmail = (session?.user as unknown as { email: string })?.email;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        addToast({ type: "error", message: "Access denied" });
        return;
      }
      setUsers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (u: AppUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, isActive: u.isActive });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "viewer", isActive: true });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name || !form.email) return;
    try {
      if (editing) {
        const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await fetch(`/api/admin/users/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        if (!form.password) {
          addToast({ type: "error", message: "Password required for new user" });
          return;
        }
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      addToast({ type: "success", message: "Saved!" });
      setShowModal(false);
      fetchUsers();
    } catch {
      addToast({ type: "error", message: "Failed" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      addToast({ type: "error", message: data.error || "Cannot delete" });
      return;
    }
    addToast({ type: "success", message: "Deleted" });
    fetchUsers();
  };

  const toggleActive = async (u: AppUser) => {
    await fetch(`/api/admin/users/${u._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    fetchUsers();
  };

  const roleBadge = (role: string) => {
    if (role === "super_admin") return <span className="bg-purple text-white text-xs font-bold px-2 py-0.5 border border-black flex items-center gap-1 w-fit" style={{ borderRadius: "2px" }}><ShieldCheck size={12} /> Super Admin</span>;
    if (role === "admin") return <span className="bg-blue text-white text-xs font-bold px-2 py-0.5 border border-black flex items-center gap-1 w-fit" style={{ borderRadius: "2px" }}><Shield size={12} /> Admin</span>;
    return <span className="bg-cream text-black text-xs font-bold px-2 py-0.5 border border-black flex items-center gap-1 w-fit" style={{ borderRadius: "2px" }}><UserIcon size={12} /> Viewer</span>;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-space">User Management</h1>
          <p className="text-sm text-black/60 mt-1">Super admin only — manage admin panel access</p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus size={14} className="mr-1" /> Add User
        </Button>
      </div>

      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Name</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Email</th>
              <th className="text-left p-3 font-bold">Role</th>
              <th className="text-left p-3 font-bold">Status</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Last Login</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-black/10">
                <td className="p-3 font-bold">{u.name}</td>
                <td className="p-3 hidden md:table-cell text-black/50">{u.email}</td>
                <td className="p-3">{roleBadge(u.role)}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(u)} className="cursor-pointer">
                    <span className={`text-xs font-bold px-2 py-0.5 border border-black ${u.isActive ? "bg-green text-black" : "bg-red text-white"}`} style={{ borderRadius: "2px" }}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                </td>
                <td className="p-3 hidden md:table-cell text-black/50 text-xs">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                </td>
                <td className="p-3 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil size={14} /></Button>
                  {u.email !== currentUserEmail && (
                    <Button size="sm" variant="ghost" onClick={() => remove(u._id)}><Trash size={14} /></Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit User" : "New User"}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label={editing ? "New Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <Select label="Role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} options={[
            { value: "viewer", label: "Viewer" },
            { value: "admin", label: "Admin" },
            { value: "super_admin", label: "Super Admin" },
          ]} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            <span className="text-sm font-bold">Active</span>
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
