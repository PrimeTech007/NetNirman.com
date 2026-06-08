"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useUIStore } from "@/lib/stores/useUIStore";

interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
}

const PAGES = [
  { key: "home", label: "Homepage", path: "/" },
  { key: "services", label: "Services", path: "/services" },
  { key: "work", label: "Work / Portfolio", path: "/work" },
  { key: "about", label: "About", path: "/about" },
  { key: "pricing", label: "Pricing", path: "/pricing" },
  { key: "contact", label: "Contact", path: "/contact" },
];

const emptyMeta = (): SEOMeta => ({ title: "", description: "", keywords: "" });

export default function SEOPage() {
  const [seoData, setSeoData] = useState<Record<string, SEOMeta>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (data.seo_meta?.value) {
        const parsed = data.seo_meta.value as Record<string, SEOMeta>;
        const hydrated: Record<string, SEOMeta> = {};
        PAGES.forEach((p) => {
          hydrated[p.key] = parsed[p.key] || emptyMeta();
        });
        setSeoData(hydrated);
      } else {
        const init: Record<string, SEOMeta> = {};
        PAGES.forEach((p) => { init[p.key] = emptyMeta(); });
        setSeoData(init);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (pageKey: string, field: keyof SEOMeta, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "seo_meta", value: seoData }),
      });
      addToast({ type: "success", message: "SEO settings saved!" });
    } catch {
      addToast({ type: "error", message: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-space">SEO Settings</h1>
          <p className="text-sm text-black/60 mt-1">Meta titles & descriptions for each public page</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-6">
        {PAGES.map((page) => (
          <div
            key={page.key}
            className="border-2 border-black shadow-brutal bg-white p-4 space-y-3"
            style={{ borderRadius: "2px" }}
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h2 className="font-black font-space">{page.label}</h2>
              <span className="text-xs font-mono text-black/50 bg-cream px-2 py-0.5 border border-black/10" style={{ borderRadius: "2px" }}>
                {page.path}
              </span>
            </div>
            <Input
              label="Meta Title"
              value={seoData[page.key]?.title || ""}
              onChange={(e) => updateField(page.key, "title", e.target.value)}
              placeholder={`${page.label} | Net Nirman`}
            />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Textarea
                  label="Meta Description"
                  value={seoData[page.key]?.description || ""}
                  onChange={(e) => updateField(page.key, "description", e.target.value)}
                  placeholder="Brief description for search engines (max 160 chars)"
                  rows={2}
                />
              </div>
              <div className="text-xs text-black/40 mt-6 flex-shrink-0">
                {(seoData[page.key]?.description || "").length}/160
              </div>
            </div>
            <Input
              label="Keywords (comma-separated)"
              value={seoData[page.key]?.keywords || ""}
              onChange={(e) => updateField(page.key, "keywords", e.target.value)}
              placeholder="web development, design, noida"
            />
            {/* Preview */}
            <div className="bg-cream border border-black/10 p-3 space-y-0.5" style={{ borderRadius: "2px" }}>
              <p className="text-sm font-bold text-blue truncate">
                {seoData[page.key]?.title || `${page.label} | Net Nirman`}
              </p>
              <p className="text-xs text-green truncate">netnirman.com{page.path}</p>
              <p className="text-xs text-black/60 line-clamp-2">
                {seoData[page.key]?.description || "No description set"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
