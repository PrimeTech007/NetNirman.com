"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  House,
  Envelope,
  Kanban,
  Briefcase,
  Users,
  Globe,
  Gear,
  SignOut,
  List,
  X,
  CaretRight,
  Palette,
  Star,
  Tag,
  MagnifyingGlassPlus,
  Article,
  User,
} from "@phosphor-icons/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/inquiries", label: "Inquiries", icon: Envelope },
  {
    label: "Projects",
    icon: Briefcase,
    children: [
      { href: "/admin/projects", label: "All Projects" },
      { href: "/admin/projects/kanban", label: "Kanban Board" },
    ],
  },
  { href: "/admin/clients", label: "Clients", icon: Users },
  {
    label: "Website CMS",
    icon: Globe,
    children: [
      { href: "/admin/website/services", label: "Services" },
      { href: "/admin/website/portfolio", label: "Portfolio" },
      { href: "/admin/website/testimonials", label: "Testimonials" },
      { href: "/admin/website/pricing", label: "Pricing" },
      { href: "/admin/website/seo", label: "SEO" },
      { href: "/admin/website/settings", label: "Settings" },
    ],
  },
  { href: "/admin/users", label: "Users", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Projects", "Website CMS"]);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isLogin = pathname === "/admin/login";
  if (isLogin) return <>{children}</>;

  const sidebar = (
    <aside className="w-64 bg-dark text-white h-full flex flex-col border-r-2 border-black shrink-0">
      {/* Logo */}
      <div className="p-4 border-b-2 border-gray-700 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/nirmanlogo.png" alt="Net Nirman admin" className="w-8 h-8" />
          <span className="font-bold font-space">Admin</span>
        </Link>
        <button className="md:hidden cursor-pointer" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          if ("children" in item && item.children) {
            const isExpanded = expandedGroups.includes(item.label);
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold hover:bg-white/10 cursor-pointer"
                  style={{ borderRadius: "2px" }}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <CaretRight size={14} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="ml-8 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 text-xs font-medium hover:bg-white/10 ${pathname === child.href ? "bg-white/20 text-yellow" : ""}`}
                        style={{ borderRadius: "2px" }}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-bold hover:bg-white/10 ${pathname === item.href ? "bg-white/20 text-yellow" : ""}`}
              style={{ borderRadius: "2px" }}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t-2 border-gray-700">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 bg-purple border border-gray-600 flex items-center justify-center text-xs font-bold" style={{ borderRadius: "2px" }}>
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{session?.user?.name || "Admin"}</p>
            <p className="text-[10px] text-gray-400 truncate">{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="cursor-pointer p-1 hover:bg-white/10" style={{ borderRadius: "2px" }}>
            <SignOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">{sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b-2 border-black flex items-center justify-between px-4 shrink-0">
          <button className="md:hidden cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <List size={24} weight="bold" />
          </button>
          <h2 className="font-bold font-space text-sm md:text-base">Net Nirman Admin</h2>
          <div className="w-8" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
