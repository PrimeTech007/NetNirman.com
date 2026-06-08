"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import * as Icons from "@phosphor-icons/react";

const categories = ["ALL", "WEB DESIGN", "WEB DEVELOPMENT", "MOBILE APP", "AI INTEGRATION", "BRANDING", "SEO"];

interface Project {
  _id: string;
  name: string;
  slug: string;
  type: string[];
  thumbnailUrl: string;
  description: string;
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Failed to fetch portfolio:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" 
    ? projects 
    : projects.filter((p) => p.type.some(t => t.toUpperCase() === filter));

  const colors = ["#FFE600", "#00FF88", "#7B2FBE", "#FF3B3B", "#0066FF"];

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black font-space mb-4">Our Work</h1>
            <p className="text-lg text-black/70">Digital products we&apos;re proud of.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 font-bold text-sm border-2 border-black transition-all cursor-pointer ${
                  filter === cat ? "bg-yellow shadow-brutal-sm" : "bg-white hover:bg-yellow/50"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-black border-t-yellow animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <Link
                    key={p._id}
                    href={`/work/${p.slug}`}
                    className="border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group overflow-hidden"
                    style={{ borderRadius: "2px" }}
                  >
                    <div
                      className="h-48 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    >
                      {p.thumbnailUrl ? (
                        <img 
                          src={p.thumbnailUrl} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Icons.Briefcase size={64} weight="duotone" className="group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="p-4 bg-white border-t-2 border-black">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.type.map(t => (
                          <span key={t} className="badge-brutal bg-cream text-[10px]">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-bold font-space text-lg">{p.name}</h3>
                      <p className="text-sm text-black/60 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white border-2 border-black shadow-brutal">
                  <p className="font-bold">No projects found for this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

