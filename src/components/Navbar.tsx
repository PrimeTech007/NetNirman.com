"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, House } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home",  },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream border-b-2 border-black">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/nirmanlogo.png" alt="Net Nirman" className="w-8 h-8" />
          <span className="font-bold text-base sm:text-lg font-space">Net Nirman</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold hover:text-blue transition-colors flex items-center gap-1"
            >
             
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/contact">
            <Button size="sm">Let&apos;s Talk</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-black bg-cream">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 px-4 font-bold text-sm border-2 border-black hover:bg-yellow transition-colors flex items-center gap-2"
                style={{ borderRadius: "2px" }}
                onClick={() => setMobileOpen(false)}
              >
                
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2">Let&apos;s Talk</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
