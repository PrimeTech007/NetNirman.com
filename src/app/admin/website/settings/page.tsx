"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Warning, Check } from "@phosphor-icons/react";

interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  businessHours: string;
}

interface SocialLinks {
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
  facebook: string;
}

interface Stats {
  projects: number;
  clients: number;
  years: number;
  onTime: number;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUIStore();

  const [announcement, setAnnouncement] = useState<AnnouncementBar>({ enabled: false, text: "", link: "" });
  const [marqueeText, setMarqueeText] = useState("");
  const [contact, setContact] = useState<ContactInfo>({ address: "", phone: "", email: "", whatsapp: "", businessHours: "" });
  const [socials, setSocials] = useState<SocialLinks>({ twitter: "", linkedin: "", instagram: "", github: "", facebook: "" });
  const [stats, setStats] = useState<Stats>({ projects: 0, clients: 0, years: 0, onTime: 0 });
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (data.announcement_bar?.value) setAnnouncement(data.announcement_bar.value);
      if (data.marquee_text?.value) setMarqueeText(data.marquee_text.value);
      if (data.contact_info?.value) setContact(data.contact_info.value);
      if (data.social_links?.value) setSocials(data.social_links.value);
      if (data.stats?.value) setStats(data.stats.value);
      if (data.maintenance_mode?.value !== undefined) setMaintenance(data.maintenance_mode.value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: unknown) => {
    await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveSetting("announcement_bar", announcement),
        saveSetting("marquee_text", marqueeText),
        saveSetting("contact_info", contact),
        saveSetting("social_links", socials),
        saveSetting("stats", stats),
        saveSetting("maintenance_mode", maintenance),
      ]);
      addToast({ type: "success", message: "All settings saved!" });
    } catch {
      addToast({ type: "error", message: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Site Settings</h1>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {/* Maintenance Mode */}
      <div className="border-2 border-black shadow-brutal bg-white p-4" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space mb-3 flex items-center gap-2">
          <Warning size={20} className="text-red" /> Maintenance Mode
        </h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setMaintenance(!maintenance)}
            className={`w-12 h-6 border-2 border-black relative cursor-pointer transition-colors ${maintenance ? "bg-red" : "bg-white"}`}
            style={{ borderRadius: "2px" }}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-all ${maintenance ? "left-6" : "left-0.5"}`}
              style={{ borderRadius: "1px" }}
            />
          </div>
          <span className="text-sm font-bold">
            {maintenance ? "Site is in maintenance mode" : "Maintenance mode is off"}
          </span>
        </label>
      </div>

      {/* Announcement Bar */}
      <div className="border-2 border-black shadow-brutal bg-white p-4 space-y-3" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space border-b-2 border-black pb-2">Announcement Bar</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={announcement.enabled} onChange={(e) => setAnnouncement((p) => ({ ...p, enabled: e.target.checked }))} />
          <span className="text-sm font-bold">Enabled</span>
        </label>
        <Input label="Announcement Text" value={announcement.text} onChange={(e) => setAnnouncement((p) => ({ ...p, text: e.target.value }))} />
        <Input label="Link URL (optional)" value={announcement.link} onChange={(e) => setAnnouncement((p) => ({ ...p, link: e.target.value }))} />
      </div>

      {/* Marquee */}
      <div className="border-2 border-black shadow-brutal bg-white p-4 space-y-3" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space border-b-2 border-black pb-2">Marquee Text</h2>
        <Input label="Marquee Strip Text" value={marqueeText} onChange={(e) => setMarqueeText(e.target.value)} />
        <p className="text-xs text-black/50">Use ☺ as separator between items</p>
      </div>

      {/* Contact Info */}
      <div className="border-2 border-black shadow-brutal bg-white p-4 space-y-3" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space border-b-2 border-black pb-2">Contact Information</h2>
        <Input label="Address" value={contact.address} onChange={(e) => setContact((p) => ({ ...p, address: e.target.value }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Phone" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
          <Input label="Email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
          <Input label="WhatsApp (with country code)" value={contact.whatsapp} onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))} />
          <Input label="Business Hours" value={contact.businessHours} onChange={(e) => setContact((p) => ({ ...p, businessHours: e.target.value }))} />
        </div>
      </div>

      {/* Social Links */}
      <div className="border-2 border-black shadow-brutal bg-white p-4 space-y-3" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space border-b-2 border-black pb-2">Social Media Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Twitter / X" value={socials.twitter} onChange={(e) => setSocials((p) => ({ ...p, twitter: e.target.value }))} />
          <Input label="LinkedIn" value={socials.linkedin} onChange={(e) => setSocials((p) => ({ ...p, linkedin: e.target.value }))} />
          <Input label="Instagram" value={socials.instagram} onChange={(e) => setSocials((p) => ({ ...p, instagram: e.target.value }))} />
          <Input label="GitHub" value={socials.github} onChange={(e) => setSocials((p) => ({ ...p, github: e.target.value }))} />
          <Input label="Facebook" value={socials.facebook} onChange={(e) => setSocials((p) => ({ ...p, facebook: e.target.value }))} />
        </div>
      </div>

      {/* Stats */}
      <div className="border-2 border-black shadow-brutal bg-white p-4 space-y-3" style={{ borderRadius: "2px" }}>
        <h2 className="font-black font-space border-b-2 border-black pb-2">Homepage Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Projects</label>
            <input
              type="number"
              value={stats.projects}
              onChange={(e) => setStats((p) => ({ ...p, projects: Number(e.target.value) }))}
              className="input-brutal w-full"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Clients</label>
            <input
              type="number"
              value={stats.clients}
              onChange={(e) => setStats((p) => ({ ...p, clients: Number(e.target.value) }))}
              className="input-brutal w-full"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Years</label>
            <input
              type="number"
              value={stats.years}
              onChange={(e) => setStats((p) => ({ ...p, years: Number(e.target.value) }))}
              className="input-brutal w-full"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">On-Time %</label>
            <input
              type="number"
              value={stats.onTime}
              onChange={(e) => setStats((p) => ({ ...p, onTime: Number(e.target.value) }))}
              className="input-brutal w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
