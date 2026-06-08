"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useUIStore } from "@/lib/stores/useUIStore";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  status: string;
  deadline: string | null;
  value: number;
  clientId?: { name: string };
}

const columns = [
  { key: "planning", label: "PLANNING", color: "#94A3B8" },
  { key: "in_progress", label: "IN PROGRESS", color: "#0066FF" },
  { key: "review", label: "REVIEW", color: "#7B2FBE" },
  { key: "completed", label: "COMPLETED", color: "#00FF88" },
  { key: "on_hold", label: "ON HOLD", color: "#FF3B3B" },
];

export default function KanbanPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { addToast } = useUIStore();

  useEffect(() => {
    fetch("/api/admin/projects?limit=100")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .catch(console.error);
  }, []);

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDrop = async (status: string) => {
    if (!draggedId) return;
    try {
      await fetch(`/api/admin/projects/${draggedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setProjects((prev) =>
        prev.map((p) => (p._id === draggedId ? { ...p, status } : p))
      );
      addToast({ type: "success", message: "Status updated" });
    } catch {
      addToast({ type: "error", message: "Failed to update" });
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button size="sm" variant="ghost"><ArrowLeft size={14} /></Button>
          </Link>
          <h1 className="text-2xl font-black font-space">Kanban Board</h1>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.status === col.key);
          return (
            <div
              key={col.key}
              className="min-w-[250px] w-[250px] flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.key)}
            >
              <div
                className="p-3 border-2 border-black text-white font-bold text-xs text-center"
                style={{ backgroundColor: col.color, borderRadius: "2px 2px 0 0" }}
              >
                {col.label} ({colProjects.length})
              </div>
              <div className="flex-1 border-2 border-t-0 border-black bg-cream/50 p-2 space-y-2 min-h-[300px]" style={{ borderRadius: "0 0 2px 2px" }}>
                {colProjects.map((p) => {
                  const isOverdue = p.deadline && new Date(p.deadline) < new Date() && col.key !== "completed";
                  return (
                    <div
                      key={p._id}
                      draggable
                      onDragStart={() => handleDragStart(p._id)}
                      className={`border-2 bg-white p-3 cursor-grab active:cursor-grabbing shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${isOverdue ? "border-red" : "border-black"}`}
                      style={{ borderRadius: "2px" }}
                    >
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-black/50 mt-1">{p.clientId?.name || "No client"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold">{"\u20B9"}{(p.value || 0).toLocaleString()}</span>
                        {p.deadline && (
                          <span className={`text-[10px] font-bold ${isOverdue ? "text-red" : "text-black/40"}`}>
                            {new Date(p.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
