"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const categories = ["ALL", "WEB", "MOBILE", "AI", "BRANDING"];

const projects = [
  { name: "E-Commerce Platform", type: "WEB", color: "#FFE600", description: "Full-stack marketplace with 10k+ products" },
  { name: "FinTech Dashboard", type: "WEB", color: "#00FF88", description: "Real-time analytics for financial data" },
  { name: "Health & Fitness App", type: "MOBILE", color: "#7B2FBE", description: "Cross-platform iOS & Android app" },
  { name: "AI Chatbot Suite", type: "AI", color: "#FF3B3B", description: "GPT-powered customer service bot" },
  { name: "Restaurant Brand", type: "BRANDING", color: "#0066FF", description: "Complete identity for chain of 12 outlets" },
  { name: "SaaS CRM Tool", type: "WEB", color: "#00FF88", description: "Customer relationship management platform" },
  { name: "Delivery App", type: "MOBILE", color: "#FFE600", description: "Last-mile logistics with real-time tracking" },
  { name: "ML Prediction Engine", type: "AI", color: "#7B2FBE", description: "Demand forecasting for retail" },
  { name: "Startup Brand Kit", type: "BRANDING", color: "#FF3B3B", description: "Full brand identity for tech startup" },
];

export default function WorkPage() {
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? projects : projects.filter((p) => p.type === filter);

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding">
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

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.name}
                href="#"
                className="border-2 border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
                style={{ borderRadius: "2px" }}
              >
                <div
                  className="h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: p.color }}
                >
                  🖥️
                </div>
                <div className="p-4 bg-white border-t-2 border-black">
                  <span className="badge-brutal bg-cream text-xs mb-2">{p.type}</span>
                  <h3 className="font-bold font-space text-lg">{p.name}</h3>
                  <p className="text-sm text-black/60 mt-1">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
