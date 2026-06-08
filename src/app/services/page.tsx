"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  PaintBrush,
  Code,
  DeviceMobile,
  Brain,
  Palette,
  MagnifyingGlass,
  ArrowRight,
} from "@phosphor-icons/react";

const services = [
  {
    icon: PaintBrush,
    name: "Web Design & UI/UX",
    color: "#00FF88",
    description: "Stunning, conversion-focused web designs tailored for Indian businesses. We create pixel-perfect interfaces that users love.",
    features: ["Custom UI/UX Design", "Mobile-First Approach", "Figma Prototypes", "Design System Creation", "User Research & Testing"],
    tech: ["Figma", "Adobe XD", "Framer"],
  },
  {
    icon: Code,
    name: "Web Development",
    color: "#7B2FBE",
    description: "Full-stack web development with modern frameworks. Fast, secure, and scalable applications built for growth.",
    features: ["Next.js & React", "Node.js Backend", "Database Design", "API Development", "Performance Optimization"],
    tech: ["Next.js", "Node.js", "MongoDB", "PostgreSQL"],
  },
  {
    icon: DeviceMobile,
    name: "Mobile App Development",
    color: "#FFE600",
    description: "Cross-platform mobile applications that work flawlessly on iOS and Android.",
    features: ["React Native Apps", "Flutter Development", "App Store Deployment", "Push Notifications", "Offline Support"],
    tech: ["React Native", "Flutter", "Firebase"],
  },
  {
    icon: Brain,
    name: "AI Integration",
    color: "#FF3B3B",
    description: "Leverage artificial intelligence to automate processes, enhance user experiences, and gain competitive advantages.",
    features: ["Chatbot Development", "AI-Powered Analytics", "Process Automation", "Machine Learning Models", "GPT Integration"],
    tech: ["OpenAI", "LangChain", "Python", "TensorFlow"],
  },
  {
    icon: Palette,
    name: "Branding & Identity",
    color: "#0066FF",
    description: "Build a memorable brand identity that resonates with your target audience and stands out in the market.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Collateral", "Social Media Kit"],
    tech: ["Illustrator", "Photoshop", "Figma"],
  },
  {
    icon: MagnifyingGlass,
    name: "SEO & Digital Marketing",
    color: "#00FF88",
    description: "Data-driven SEO and digital marketing strategies to boost your online visibility and drive organic growth.",
    features: ["Technical SEO", "Content Strategy", "Google Ads", "Social Media Marketing", "Analytics & Reporting"],
    tech: ["Google Analytics", "SEMrush", "Ahrefs"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-space mb-4">Our Services</h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              End-to-end digital solutions to take your business from idea to impact.
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, i) => (
              <div
                key={service.name}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
              >
                {/* Icon/Visual */}
                <div
                  className="w-full md:w-1/3 aspect-square border-2 border-black shadow-brutal flex items-center justify-center"
                  style={{ backgroundColor: service.color, borderRadius: "2px" }}
                >
                  <service.icon size={120} weight="duotone" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-black font-space">{service.name}</h2>
                  <p className="text-black/70">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium">
                        <span className="w-2 h-2 bg-black inline-block" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {service.tech.map((t) => (
                      <span key={t} className="badge-brutal bg-white">{t}</span>
                    ))}
                  </div>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Get Quote <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
