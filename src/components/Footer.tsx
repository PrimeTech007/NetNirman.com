"use client";

import Link from "next/link";
import {
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  GithubLogo,
  FacebookLogo,
  Phone,
  Envelope,
  Globe,
  Shield,
} from "@phosphor-icons/react";

const serviceLinks = [
  { href: "/services", label: "Web Design" },
  { href: "/services", label: "Development" },
  { href: "/services", label: "Mobile Apps" },
  { href: "/services", label: "AI Integration" },
  { href: "/services", label: "Branding & SEO" },
];

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/work", label: "Our Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { icon: TwitterLogo, href: "#", label: "Twitter" },
  { icon: LinkedinLogo, href: "#", label: "LinkedIn" },
  { icon: InstagramLogo, href: "#", label: "Instagram" },
  { icon: GithubLogo, href: "#", label: "GitHub" },
  { icon: FacebookLogo, href: "#", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo + Socials */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/nirmanlogo.png" alt="Net Nirman" className="w-8 h-8" />
              <span className="font-bold text-lg font-space">Net Nirman</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Building digital empires for startups and growing businesses. Your vision, our execution.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 border-2 border-gray-600 flex items-center justify-center hover:border-yellow hover:text-yellow transition-colors"
                  style={{ borderRadius: "2px" }}
                  aria-label={s.label}
                >
                  <s.icon size={18} weight="fill" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-bold font-space mb-4 text-yellow">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company + Contact */}
          <div>
            <h4 className="font-bold font-space mb-4 text-yellow">Company</h4>
            <ul className="space-y-2 mb-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>netnirman.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 78188 32387 <br />+91 75003 97790</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope size={16} />
                <span>teamnetnirman@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login + Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          {/* Admin Login Button */}
          <div className="flex justify-center mb-6">
            <Link href="/admin/login">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-yellow border border-gray-700 hover:border-yellow px-4 py-2 transition-all cursor-pointer" style={{ borderRadius: "2px" }}>
                <Shield size={14} />
                Admin Login
              </span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Net Nirman. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Built with passion for ambitious startups
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
