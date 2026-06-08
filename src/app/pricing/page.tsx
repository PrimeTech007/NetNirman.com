"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";

const plans = [
  {
    name: "Starter",
    priceRange: "₹15,000 – ₹30,000",
    description: "Perfect for startups and small businesses getting online.",
    color: "#00FF88",
    isPopular: false,
    features: ["5-Page Responsive Website", "Mobile Optimized", "Contact Form", "Basic SEO Setup", "1 Month Support", "SSL Certificate"],
  },
  {
    name: "Growth",
    priceRange: "₹30,000 – ₹80,000",
    description: "For growing businesses needing advanced features.",
    color: "#FFE600",
    isPopular: true,
    features: ["Up to 15 Pages", "Custom CMS/Admin", "E-commerce (up to 50 products)", "Advanced SEO", "Analytics Dashboard", "3 Months Support", "Performance Optimization"],
  },
  {
    name: "Enterprise",
    priceRange: "₹80,000+",
    description: "Full-scale digital solutions for established businesses.",
    color: "#7B2FBE",
    isPopular: false,
    features: ["Unlimited Pages", "Custom Web Application", "AI Integration", "Mobile App (Optional)", "Priority Support (6 months)", "Dedicated Project Manager", "Source Code Ownership", "API Development"],
  },
];

const faqData = [
  { question: "How long does a typical project take?", answer: "A standard website takes 2-4 weeks. Complex web applications can take 6-12 weeks depending on requirements." },
  { question: "Do you provide post-launch support?", answer: "Yes! All our plans include post-launch support. Starter includes 1 month, Growth includes 3 months, and Enterprise includes 6 months." },
  { question: "What technologies do you use?", answer: "We primarily use Next.js, React, Node.js, MongoDB, and modern cloud services. We choose the best tech stack based on your project needs." },
  { question: "Can you work with existing designs?", answer: "Absolutely! We can implement any design from Figma, Adobe XD, or Sketch. We also offer design services if you need them." },
  { question: "Do you offer EMI/payment plans?", answer: "Yes, we offer flexible payment plans. Typically 50% upfront and 50% on delivery, or custom arrangements for larger projects." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-space mb-4">Pricing</h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Transparent pricing for every stage of your business. No hidden costs.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border-2 border-black shadow-brutal flex flex-col relative ${plan.isPopular ? "scale-105 z-10" : ""}`}
                style={{ borderRadius: "2px", backgroundColor: plan.color }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 text-xs font-bold border-2 border-black" style={{ borderRadius: "2px" }}>
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black font-space">{plan.name}</h3>
                  <div className="text-2xl font-black font-space mt-2">{plan.priceRange}</div>
                  <p className="text-sm text-black/70 mt-2 mb-6">{plan.description}</p>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check size={16} weight="bold" className="shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-6">
                    <Button className="w-full" variant={plan.isPopular ? "primary" : "outline"}>
                      GET STARTED
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black font-space text-center mb-8">FAQ</h2>
            <div className="space-y-3">
              {faqData.map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-black bg-white"
                  style={{ borderRadius: "2px" }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 font-bold text-left cursor-pointer hover:bg-yellow/20 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.question}</span>
                    {openFaq === i ? <CaretUp size={20} weight="bold" /> : <CaretDown size={20} weight="bold" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-black/70 border-t-2 border-black">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
