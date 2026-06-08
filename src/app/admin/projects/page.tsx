"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Eye } from "@phosphor-icons/react";

interface Project {
  _id: string;
  name: string;
  status: string;
  type: string[];
  deadline: string | null;
  value: number;
  paymentStatus: string;
  clientId?: { name: string; company: string };
}

const statusColors: Record<string, string> = {
  planning: "#94A3B8",
  in_progress: "#0066FF",
  review: "#7B2FBE",
  completed: "#00FF88",
  on_hold: "#FF3B3B",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", status: "planning", value: 0 });
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    if (!newProject.name) return;
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        addToast({ type: "success", message: "Project created!" });
        setShowAddModal(false);
        setNewProject({ name: "", status: "planning", value: 0 });
        fetchProjects();
      }
    } catch {
      addToast({ type: "error", message: "Failed to create project" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Projects</h1>
        <div className="flex gap-2">
          <Link href="/admin/projects/kanban">
            <Button size="sm" variant="outline">Kanban Board</Button>
          </Link>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} className="mr-1" /> Add Project
          </Button>
        </div>
      </div>

      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Name</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Client</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">Type</th>
              <th className="text-left p-3 font-bold">Status</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Deadline</th>
              <th className="text-left p-3 font-bold hidden md:table-cell">Value (INR)</th>
              <th className="text-left p-3 font-bold hidden lg:table-cell">Payment</th>
              <th className="text-left p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-8 text-center text-black/50">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-black/50">No projects yet</td></tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id} className="border-b border-black/10 hover:bg-cream/30">
                  <td className="p-3 font-bold">{p.name}</td>
                  <td className="p-3 hidden md:table-cell">{p.clientId?.name || "-"}</td>
                  <td className="p-3 hidden lg:table-cell">{p.type?.join(", ") || "-"}</td>
                  <td className="p-3">
                    <span className="badge-brutal text-[10px]" style={{ backgroundColor: statusColors[p.status] || "#FFE600" }}>
                      {p.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString() : "-"}
                    {p.deadline && new Date(p.deadline) < new Date() && p.status !== "completed" && (
                      <span className="ml-1 text-red font-bold">OVERDUE</span>
                    )}
                  </td>
                  <td className="p-3 hidden md:table-cell">{"\u20B9"}{(p.value || 0).toLocaleString()}</td>
                  <td className="p-3 hidden lg:table-cell">{p.paymentStatus}</td>
                  <td className="p-3">
                    <Link href={`/admin/projects/${p._id}`}>
                      <Button size="sm" variant="ghost"><Eye size={14} /></Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Project">
        <div className="space-y-4">
          <Input label="Project Name" value={newProject.name} onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))} />
          <Select
            label="Status"
            value={newProject.status}
            onChange={(e) => setNewProject((p) => ({ ...p, status: e.target.value }))}
            options={[
              { value: "planning", label: "Planning" },
              { value: "in_progress", label: "In Progress" },
              { value: "review", label: "Review" },
              { value: "completed", label: "Completed" },
              { value: "on_hold", label: "On Hold" },
            ]}
          />
          <Input label="Value (INR)" type="number" value={String(newProject.value)} onChange={(e) => setNewProject((p) => ({ ...p, value: Number(e.target.value) }))} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={addProject}>Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
