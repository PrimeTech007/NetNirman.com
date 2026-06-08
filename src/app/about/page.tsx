"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Check, X } from "@phosphor-icons/react";

const values = [
  { title: "Bold Design", description: "We don't do boring. Every pixel is crafted to make a statement.", color: "#FFE600" },
  { title: "Clean Code", description: "Scalable, maintainable, and well-documented code is our standard.", color: "#00FF88" },
  { title: "Client First", description: "Your success is our success. We're invested in every project.", color: "#7B2FBE" },
  { title: "Speed & Quality", description: "Fast delivery without compromising on quality or testing.", color: "#FF3B3B" },
];

const team = [
  { name: "Dheeraj Kumar", role: "Founder & Lead Developer", emoji: "👨‍💻" },
  { name: "Ananya Singh", role: "UI/UX Designer", emoji: "🎨" },
  { name: "Rahul Verma", role: "Backend Developer", emoji: "⚙️" },
  { name: "Neha Gupta", role: "Project Manager", emoji: "📋" },
];

const comparisonData = [
  { feature: "Dedicated Project Manager", netNirman: true, others: false },
  { feature: "100% On-Time Delivery", netNirman: true, others: false },
  { feature: "Post-Launch Support Included", netNirman: true, others: false },
  { feature: "Source Code Ownership", netNirman: true, others: false },
  { feature: "Weekly Progress Reports", netNirman: true, others: false },
  { feature: "No Hidden Charges", netNirman: true, others: false },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-space mb-6">About Net Nirman</h1>
          <p className="text-lg text-black/70 max-w-3xl mx-auto">
            We&apos;re a passionate team of digital craftsmen building powerful
            digital products for startups and growing businesses worldwide.
            Since 2023, we&apos;ve been helping ambitious teams drive real results.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-yellow py-16 px-4 border-y-2 border-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black font-space mb-6">Our Story</h2>
          <div className="space-y-4 text-black/80">
            <p>
              Net Nirman was born from a simple idea: startups and growing businesses deserve world-class
              digital products without the enterprise price tag. Our founder, frustrated by
              the gap between expensive agencies and unreliable freelancers, set out to build
              a team that delivers both quality and value.
            </p>
            <p>
              Today, we&apos;ve delivered 50+ projects for 30+ clients worldwide, from
              early-stage startups to established enterprises. Our approach combines
              cutting-edge technology with a deep understanding of what growing businesses need.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black font-space text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} color={v.color} className="text-center">
                <h3 className="text-xl font-bold font-space mb-2">{v.title}</h3>
                <p className="text-sm text-black/70">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white section-padding border-y-2 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black font-space text-center mb-12">The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div
                key={t.name}
                className="border-2 border-black shadow-brutal bg-cream text-center p-6"
                style={{ borderRadius: "2px" }}
              >
                <div className="text-6xl mb-4">{t.emoji}</div>
                <h3 className="font-bold font-space">{t.name}</h3>
                <p className="text-sm text-black/60">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Net Nirman */}
      <section className="bg-cream section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black font-space text-center mb-12">Why Net Nirman?</h2>
          <div className="border-2 border-black shadow-brutal bg-white overflow-hidden" style={{ borderRadius: "2px" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black bg-yellow">
                  <th className="text-left p-4 font-bold font-space">Feature</th>
                  <th className="p-4 font-bold font-space">Net Nirman</th>
                  <th className="p-4 font-bold font-space">Others</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "" : "bg-cream"}>
                    <td className="p-4 text-sm border-b border-black/10">{row.feature}</td>
                    <td className="p-4 text-center border-b border-black/10">
                      {row.netNirman ? <Check size={20} weight="bold" className="text-green mx-auto" /> : <X size={20} weight="bold" className="text-red mx-auto" />}
                    </td>
                    <td className="p-4 text-center border-b border-black/10">
                      {row.others ? <Check size={20} weight="bold" className="text-green mx-auto" /> : <X size={20} weight="bold" className="text-red mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black font-space text-white mb-6">Ready to work with us?</h2>
          <Link href="/contact">
            <Button size="lg">GET IN TOUCH</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
