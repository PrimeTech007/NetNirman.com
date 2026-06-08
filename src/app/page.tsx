"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import AnimatedCounter from "@/components/AnimatedCounter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";
import * as Icons from "@phosphor-icons/react";
import {
  PaintBrush,
  Code,
  Brain,
  Palette,
  ArrowRight,
  Star,
  Laptop,
  Terminal,
  Cpu,
  Rocket,
  FigmaLogo,
  Database,
  GearSix,
  Lightning,
  Globe,
  Cloud,
  ShieldCheck,
  ArrowsOut,
} from "@phosphor-icons/react";

interface Service {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface Testimonial {
  _id: string;
  clientName: string;
  company: string;
  quote: string;
  rating: number;
}

interface SiteStats {
  projects: number;
  clients: number;
  years: number;
  onTime: number;
}

const techStacks = [
  { label: "Next.js", position: "top-3 left-5" },
  { label: "React", position: "top-14 right-4" },
  { label: "TypeScript", position: "top-28 left-4" },
  { label: "Tailwind", position: "top-40 left-16" },
  { label: "Node.js", position: "bottom-10 right-4" },
  { label: "MongoDB", position: "top-24 right-1" },
  { label: "AI/ML", position: "bottom-16 left-20" },
  { label: "Figma", position: "top-22 left-24" },
  { label: "Prisma", position: "bottom-4 left-10" },
  { label: "GraphQL", position: "right-14 top-6" },
];

const techMetrics = [
  { label: "Realtime APIs", value: "98%", colorClass: "progress-first" },
  { label: "AI recommendations", value: "95%", colorClass: "progress-second" },
  { label: "Visual analytics", value: "94%", colorClass: "progress-third" },
];

const featureBadges = [
  { label: "CLOUD-NATIVE", icon: Cloud },
  { label: "FAST DEPLOYMENT", icon: Rocket },
  { label: "SECURE", icon: ShieldCheck },
  { label: "SCALABLE", icon: ArrowsOut },
];

function TechDashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="tech-dashboard-card relative w-[380px] bg-[#0A0A0A] border-[3px] border-black shadow-hard-yellow p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="badge-live">● LIVE SYSTEM</div>
        <div className="badge-latency">0.8s LATENCY</div>
      </div>

      <div className="space-y-5">
        {techMetrics.map((metric, idx) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-value">{metric.value}</span>
            </div>
            <div className="progress-track">
              <motion.div
                className={`progress-bar ${metric.colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: metric.value }}
                transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {featureBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="feature-badge group">
              <div className="flex items-center gap-2">
                <Icon size={16} weight="regular" className="feature-icon" />
                <span>{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute left-[-20px] bottom-[-20px] w-[80px] h-[80px] border-2 border-[#FFE600] rotate-circle">
        <div className="orbit-dot" />
      </div>
    </motion.div>
  );
}

function TechLaptopIllustration() {
  const lineConfigs = [
    { width: "70%", bg: "#FFE600" },
    { width: "50%", bg: "#00FF88" },
    { width: "85%", bg: "#7B2FBE" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: [0, -3, 0] }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" },
        y: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[190px]"
    >
      <div
        className="absolute left-1/2 top-[182px] -translate-x-1/2 w-[200px] h-[8px] bg-black"
        style={{ opacity: 0.15 }}
      />

      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[220px] h-[150px] bg-[#0A0A0A] border-[3px] border-black shadow-[6px_6px_0px_#000]">
        <div className="absolute inset-0 m-[8px] border-[8px] border-[#111] box-border">
          <div className="absolute top-[10px] left-[12px] flex items-center gap-[6px]">
            <div className="w-[8px] h-[8px] bg-[#FF3B3B] border-[1.5px] border-black" />
            <div className="w-[8px] h-[8px] bg-[#FFE600] border-[1.5px] border-black" />
            <div className="w-[8px] h-[8px] bg-[#00FF88] border-[1.5px] border-black" />
          </div>

          <div className="absolute left-[12px] right-[12px] top-[32px] space-y-[10px]">
            {lineConfigs.map((line, index) => (
              <motion.div
                key={line.bg}
                initial={{ width: 0 }}
                animate={{ width: line.width }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
                className="h-[4px] border-[1px] border-black"
                style={{ backgroundColor: line.bg }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[154px] -translate-x-1/2 w-[240px] h-[16px] bg-[#FFE600] border-[3px] border-black shadow-[4px_4px_0px_#000]" />
      <div className="absolute left-1/2 top-[156px] -translate-x-1/2 w-[50px] h-[8px] bg-black border-[1.5px] border-[#FFE600]" />

      <motion.div
        className="absolute top-[-20px] right-[-14px] w-[20px] h-[20px] bg-[#FFE600] border-[2px] border-black"
        style={{ rotate: "15deg" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-18px] left-[-14px] w-[16px] h-[16px] bg-[#00FF88] border-[2px] border-black rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
      />
    </motion.div>
  );
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<SiteStats>({ projects: 50, clients: 30, years: 3, onTime: 100 });
  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats
    fetch("/api/site-settings/public")
      .then(r => r.json())
      .then(data => {
        const statData = data.find((s: any) => s.key === "stats");
        if (statData) setStats(statData.value);
      });

    // Fetch services
    fetch("/api/services").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setServices(data.slice(0, 4));
    });

    // Fetch testimonials
    fetch("/api/testimonials").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setTestimonials(data.slice(0, 3));
    });

    // Fetch portfolio preview
    fetch("/api/portfolio").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPortfolio(data.slice(0, 3));
    });
  }, []);

  const getIcon = (name: string, size = 36) => {
    const Icon = (Icons as any)[name] || Code;
    return <Icon size={size} weight="duotone" />;
  };

  const serviceColors = ["#00FF88", "#7B2FBE", "#FFE600", "#0066FF"];
  const portfolioColors = ["#FFE600", "#00FF88", "#7B2FBE"];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-cream section-padding section-padding-tight relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow/20 border-2 border-yellow/30 rounded-full blur-sm" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-green/20 border-2 border-green/30 rounded-full blur-sm" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-purple/15 rounded-full blur-sm" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-2 shadow-brutal-sm" style={{ borderRadius: "2px" }}>
              <Lightning size={18} weight="fill" className="text-yellow" />
              <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Web & Software development Agency</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-space leading-tight">
              We Build High-Performance Systems That{" "}
              <span className="relative inline-block">
                2x Your Sales.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q50 2 100 5 T198 3" stroke="#FFE600" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-black/70 max-w-xl font-inter leading-relaxed">
              We are Net Nirman, We build the high-speed websites, custom Software, and
              landing pages you need to turn random traffic into paying customers and maximize your revenue.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/work">
                <Button size="lg">
                  <span className="flex items-center gap-2">
                    SEE OUR WORK <ArrowRight size={18} weight="bold" />
                  </span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  LET&apos;S TALK
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {["#FFE600", "#00FF88", "#7B2FBE", "#0066FF"].map((c, i) => (
                  <div key={i} className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c, borderRadius: "50%" }}>
                    {["M", "E", "R", "N"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} weight="fill" className="text-yellow" />
                  ))}
                </div>
                <p className="text-xs text-black/60 font-bold">Trusted by 30+ businesses</p>
              </div>
            </div>
          </div>

          {/* Tech Icon Cluster */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-80 h-80 md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] overflow-hidden rounded-3xl border-2 border-black bg-black/5 shadow-brutal">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow/15 via-white/10 to-green/10" />
              <div className="absolute top-3 left-3 w-16 h-16 md:w-20 md:h-20 border-2 border-black rounded-sm bg-white/80 shadow-brutal-sm" />
              <div className="absolute bottom-3 right-3 w-20 h-20 md:w-24 md:h-24 border-2 border-black rounded-sm bg-yellow/80 shadow-brutal-sm" />

              {/* Central laptop icon */}
              <TechLaptopIllustration />

              {/* Floating tech stack tags */}
              {techStacks.map((stack, index) => (
                <div
                  key={stack.label}
                  className={`absolute ${stack.position} min-w-[70px] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white border-2 border-yellow rounded-sm shadow-brutal-sm z-30 ${index % 2 === 0 ? "animate-float" : "animate-float-slow"}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {stack.label}
                </div>
              ))}

              {/* Orbiting tech icons */}
              <div className="absolute top-2 left-12 w-16 h-16 bg-yellow border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float" style={{ animationDuration: "3s" }}>
                <Code size={28} weight="bold" className="text-black" />
              </div>
              <div className="absolute top-8 right-6 w-20 h-20 bg-green border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float-slow" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}>
                <Terminal size={32} weight="bold" className="text-black" />
              </div>
              <div className="absolute bottom-12 left-2 w-18 h-18 bg-purple border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float" style={{ animationDuration: "2.8s", animationDelay: "0.6s" }}>
                <Cpu size={30} weight="bold" className="text-white" />
              </div>
              <div className="absolute bottom-4 right-10 w-14 h-14 bg-red border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float-slow" style={{ animationDuration: "3.2s", animationDelay: "0.9s" }}>
                <Rocket size={24} weight="bold" className="text-white" />
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-14 h-14 bg-cream border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float" style={{ animationDuration: "2.6s", animationDelay: "1.2s" }}>
                <GearSix size={24} weight="bold" className="text-black" />
              </div>
              <div className="absolute top-1/3 left-0 w-12 h-12 bg-white border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float-slow" style={{ animationDuration: "3.4s", animationDelay: "0.5s" }}>
                <FigmaLogo size={20} weight="bold" className="text-black" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-dark border-2 border-black shadow-brutal-sm rounded-full flex items-center justify-center animate-float" style={{ animationDuration: "2.9s", animationDelay: "0.8s" }}>
                <Database size={26} weight="bold" className="text-yellow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <Marquee />

      {/* About Teaser */}
      <section className="bg-yellow section-padding relative">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-8 top-12 h-0.5 w-24 bg-black" />
          <div className="absolute right-8 top-24 h-0.5 w-32 bg-black/50" />
          <div className="absolute left-1/2 top-2/3 h-40 w-0.5 bg-black/40" />
          <div className="absolute right-16 bottom-16 h-0.5 w-28 bg-black/40" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black shadow-brutal-sm rounded-sm uppercase tracking-[0.35em] text-[16px]">
            What We Use & Do ?
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-space leading-tight">
              Connecting Ideas to Digital Reality.
            </h2>
            <p className="text-lg font-inter text-black/90 leading-relaxed max-w-xl">
              We partner with startups, SMEs, and enterprises worldwide to build powerful digital products.
              From pixel-perfect websites to intelligent AI solutions, we turn your vision into reality with clean code,
              bold design, and cutting-edge engineering.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              {["HTML5 & CSS3", "React", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Docker & Kubernetes","GitHub Actions", "& Many More"].map((tech, index) => (
                <div
                  key={tech}
                  className={`relative overflow-hidden border-2 border-black bg-black text-white px-3 py-2 rounded-sm shadow-brutal ${index % 2 === 0 ? 'animate-pulse-slow' : 'animate-glow'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{tech}</span>
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow shadow-yellow-glow" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <TechDashboardCard />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={stats.projects} label="Projects Delivered" />
          <AnimatedCounter end={stats.clients} label="Happy Clients" />
          <AnimatedCounter end={stats.years} label="Years Experience" />
          <AnimatedCounter end={stats.onTime} suffix="%" label="On-Time Delivery" />
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-green text-black text-xs font-bold px-3 py-1 border-2 border-black uppercase" style={{ borderRadius: "2px" }}>Our Services</span>
            <h2 className="text-3xl md:text-5xl font-black font-space mt-4">
              What We Build
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(services.length > 0 ? services : Array.from({ length: 4 })).map((s: any, i) => (
              <Card
                key={s?._id || i}
                tilt={i % 2 === 0 ? "left" : "right"}
                color={serviceColors[i % serviceColors.length]}
                className="flex flex-col items-center text-center gap-4 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors" style={{ borderRadius: "2px" }}>
                  {s ? getIcon(s.icon) : <Code size={36} />}
                </div>
                <h3 className="text-xl font-bold font-space">{s?.name || "Service Name"}</h3>
                <ArrowRight size={20} weight="bold" className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-white section-padding border-y-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="bg-blue text-white text-xs font-bold px-3 py-1 border-2 border-black uppercase" style={{ borderRadius: "2px" }}>Portfolio</span>
              <h2 className="text-3xl md:text-5xl font-black font-space mt-4">Our Work</h2>
            </div>
            <Link href="/work">
              <Button variant="outline" size="sm">
                View All <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(portfolio.length > 0 ? portfolio : Array.from({ length: 3 })).map((p: any, i) => (
              <div
                key={p?._id || i}
                className="border-2 border-black shadow-brutal hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all cursor-pointer group overflow-hidden"
                style={{ borderRadius: "2px" }}
              >
                <div className="h-48 flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: portfolioColors[i % portfolioColors.length] }}>
                  {p?.thumbnailUrl ? (
                    <img src={p.thumbnailUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Globe size={72} weight="duotone" className="text-black" />
                  )}
                </div>
                <div className="p-4 bg-white border-t-2 border-black">
                  <h3 className="font-bold font-space">{p?.name || "Project Name"}</h3>
                  <p className="text-sm text-black/60">{p?.type?.join(", ") || "Project Type"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-purple text-white text-xs font-bold px-3 py-1 border-2 border-black uppercase" style={{ borderRadius: "2px" }}>Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black font-space mt-4">
              What Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonials.length > 0 ? testimonials : Array.from({ length: 3 })).map((t: any, i) => (
              <Card key={t?._id || i} className="flex flex-col group hover:border-blue transition-colors">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} weight="fill" className={i < (t?.rating || 5) ? "text-yellow" : "text-black/10"} />
                  ))}
                </div>
                <p className="text-sm italic mb-4 flex-1">&ldquo;{t?.quote || "Client quote goes here."}&rdquo;</p>
                <div className="border-t border-black/10 pt-3">
                  <p className="font-bold text-sm">{t?.clientName || "Client Name"}</p>
                  <p className="text-xs text-black/60">{t?.company || "Company Name"}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-yellow rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="bg-yellow text-black text-xs font-bold px-3 py-1 border-2 border-yellow uppercase inline-block mb-6" style={{ borderRadius: "2px" }}>
            Let&apos;s Work Together
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-space text-white mb-6">
            Got a project? Let&apos;s build it.
          </h2>
          <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
            Tell us about your idea and we&apos;ll bring it to life with cutting-edge tech.
            From concept to launch, we handle it all.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                <span className="flex items-center gap-2">
                  START YOUR PROJECT <Rocket size={18} weight="bold" />
                </span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">VIEW PRICING</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
