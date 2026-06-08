"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Eye, EyeSlash, Star } from "@phosphor-icons/react";

interface Project {
  _id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  isFeatured: boolean;
}

export default function PortfolioCMSPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects?limit=100")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []));
  }, []);

  const toggle = async (id: string, field: string, value: boolean) => {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !value }),
    });
    setProjects((prev) => prev.map((p) => p._id === id ? { ...p, [field]: !value } : p));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black font-space">Portfolio CMS</h1>
      <p className="text-sm text-black/60">Toggle visibility and featured status for portfolio projects.</p>
      <div className="border-2 border-black shadow-brutal bg-white overflow-x-auto" style={{ borderRadius: "2px" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-2 border-black">
              <th className="text-left p-3 font-bold">Project</th>
              <th className="text-left p-3 font-bold">Public</th>
              <th className="text-left p-3 font-bold">Featured</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-b border-black/10">
                <td className="p-3 font-bold">{p.name}</td>
                <td className="p-3">
                  <button onClick={() => toggle(p._id, "isPublic", p.isPublic)} className="cursor-pointer">
                    {p.isPublic ? <Eye size={18} className="text-green" /> : <EyeSlash size={18} className="text-red" />}
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => toggle(p._id, "isFeatured", p.isFeatured)} className="cursor-pointer">
                    <Star size={18} weight={p.isFeatured ? "fill" : "regular"} className={p.isFeatured ? "text-yellow" : "text-black/30"} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-black/50">No projects yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
