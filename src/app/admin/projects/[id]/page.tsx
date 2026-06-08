"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useUIStore } from "@/lib/stores/useUIStore";
import { ArrowLeft, CheckCircle, Circle } from "@phosphor-icons/react";

interface ProjectDetail {
  _id: string;
  name: string;
  slug: string;
  status: string;
  type: string[];
  description: string;
  techStack: string[];
  startDate: string | null;
  deadline: string | null;
  value: number;
  paymentStatus: string;
  amountReceived: number;
  isPublic: boolean;
  isFeatured: boolean;
  milestones: { _id: string; title: string; dueDate: string; completed: boolean; completedAt: string | null }[];
  notes: { content: string; createdBy: string; createdAt: string }[];
  files: { name: string; url: string }[];
  clientId?: { name: string; company: string; email: string; phone: string };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useUIStore();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tab, setTab] = useState("overview");
  const [noteInput, setNoteInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState({ title: "", dueDate: "" });

  useEffect(() => {
    fetch(`/api/admin/projects/${params.id}`)
      .then((r) => r.json())
      .then(setProject)
      .catch(console.error);
  }, [params.id]);

  const addNote = async () => {
    if (!noteInput.trim()) return;
    const res = await fetch(`/api/admin/projects/${params.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteInput }),
    });
    if (res.ok) {
      const data = await res.json();
      setProject((p) => p ? { ...p, notes: [...p.notes, data] } : p);
      setNoteInput("");
      addToast({ type: "success", message: "Note added" });
    }
  };

  const addMilestone = async () => {
    if (!milestoneInput.title || !milestoneInput.dueDate) return;
    const res = await fetch(`/api/admin/projects/${params.id}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(milestoneInput),
    });
    if (res.ok) {
      const data = await res.json();
      setProject((p) => p ? { ...p, milestones: [...p.milestones, data] } : p);
      setMilestoneInput({ title: "", dueDate: "" });
      addToast({ type: "success", message: "Milestone added" });
    }
  };

  const toggleMilestone = async (mid: string, completed: boolean) => {
    const res = await fetch(`/api/admin/projects/${params.id}/milestones/${mid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      setProject((p) =>
        p ? { ...p, milestones: p.milestones.map((m) => m._id === mid ? { ...m, completed: !m.completed } : m) } : p
      );
    }
  };

  if (!project) return <div className="text-center py-8">Loading...</div>;

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const progressPct = project.milestones.length > 0 ? Math.round((completedMilestones / project.milestones.length) * 100) : 0;

  const tabs = ["overview", "milestones", "notes", "files", "client"];

  return (
    <div className="space-y-4 max-w-5xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:underline">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black font-space">{project.name}</h1>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge color={project.status === "completed" ? "#00FF88" : "#0066FF"}>{project.status?.replace("_", " ")}</Badge>
            {project.type?.map((t) => <Badge key={t} color="#F5F0E8">{t}</Badge>)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black font-space">{"\u20B9"}{(project.value || 0).toLocaleString()}</p>
          <p className="text-xs text-black/50">{project.paymentStatus} | Received: {"\u20B9"}{(project.amountReceived || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b-2 border-black">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-bold capitalize cursor-pointer border-2 border-b-0 ${tab === t ? "bg-yellow border-black" : "bg-white border-transparent"}`}
            style={{ borderRadius: "2px 2px 0 0" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="border-2 border-black shadow-brutal bg-white p-6" style={{ borderRadius: "2px" }}>
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-xs font-bold text-black/50">Start</span><p className="font-bold text-sm">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p></div>
              <div><span className="text-xs font-bold text-black/50">Deadline</span><p className="font-bold text-sm">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "-"}</p></div>
              <div><span className="text-xs font-bold text-black/50">Public</span><p className="font-bold text-sm">{project.isPublic ? "Yes" : "No"}</p></div>
              <div><span className="text-xs font-bold text-black/50">Featured</span><p className="font-bold text-sm">{project.isFeatured ? "Yes" : "No"}</p></div>
            </div>
            {project.description && (
              <div>
                <span className="text-xs font-bold text-black/50">Description</span>
                <div className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            )}
            {project.techStack?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-black/50">Tech Stack</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.techStack.map((t) => <Badge key={t} color="#F5F0E8">{t}</Badge>)}
                </div>
              </div>
            )}
            {/* Progress bar */}
            <div>
              <span className="text-xs font-bold text-black/50">Milestone Progress: {progressPct}%</span>
              <div className="mt-1 h-4 bg-cream border border-black" style={{ borderRadius: "2px" }}>
                <div className="h-full bg-green transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {tab === "milestones" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input className="input-brutal flex-1" placeholder="Milestone title" value={milestoneInput.title} onChange={(e) => setMilestoneInput((p) => ({ ...p, title: e.target.value }))} />
              <input className="input-brutal w-40" type="date" value={milestoneInput.dueDate} onChange={(e) => setMilestoneInput((p) => ({ ...p, dueDate: e.target.value }))} />
              <Button size="sm" onClick={addMilestone}>Add</Button>
            </div>
            <div className="space-y-2">
              {project.milestones.map((m) => (
                <div key={m._id} className="flex items-center gap-3 p-3 border border-black/10">
                  <button onClick={() => toggleMilestone(m._id, m.completed)} className="cursor-pointer">
                    {m.completed ? <CheckCircle size={20} weight="fill" className="text-green" /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${m.completed ? "line-through text-black/40" : ""}`}>{m.title}</p>
                    <p className="text-xs text-black/50">Due: {new Date(m.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {project.milestones.length === 0 && <p className="text-sm text-black/50 text-center">No milestones yet</p>}
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input className="input-brutal flex-1" placeholder="Add a note..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} />
              <Button size="sm" onClick={addNote}>Add</Button>
            </div>
            <div className="space-y-3">
              {project.notes.map((n, i) => (
                <div key={i} className="flex gap-3 p-3 border border-black/10">
                  <div className="w-8 h-8 bg-yellow border border-black flex items-center justify-center text-xs font-bold shrink-0" style={{ borderRadius: "2px" }}>
                    {n.createdBy?.charAt(0) || "A"}
                  </div>
                  <div>
                    <div className="flex gap-2"><span className="font-bold text-sm">{n.createdBy}</span><span className="text-xs text-black/40">{new Date(n.createdAt).toLocaleString()}</span></div>
                    <p className="text-sm mt-1">{n.content}</p>
                  </div>
                </div>
              ))}
              {project.notes.length === 0 && <p className="text-sm text-black/50 text-center">No notes yet</p>}
            </div>
          </div>
        )}

        {tab === "files" && (
          <div>
            {project.files.length === 0 ? (
              <p className="text-sm text-black/50 text-center">No files uploaded</p>
            ) : (
              <div className="space-y-2">
                {project.files.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" className="flex items-center gap-2 p-3 border border-black/10 hover:bg-cream/50">
                    <span className="font-bold text-sm">{f.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "client" && (
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-xs font-bold text-black/50">Name</span><p className="font-bold">{project.clientId?.name || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">Company</span><p className="font-bold">{project.clientId?.company || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">Email</span><p className="font-bold">{project.clientId?.email || "-"}</p></div>
            <div><span className="text-xs font-bold text-black/50">Phone</span><p className="font-bold">{project.clientId?.phone || "-"}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
