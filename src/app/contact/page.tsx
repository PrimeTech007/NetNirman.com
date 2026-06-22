"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { inquirySchema, InquiryInput } from "@/lib/validations";
import { useUIStore } from "@/lib/stores/useUIStore";
import { WhatsappLogo, MapPin, Clock, Phone, Envelope } from "@phosphor-icons/react";

const projectTypes = [
  { value: "", label: "Select project type..." },
  { value: "website", label: "Website" },
  { value: "web_app", label: "Web Application" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "ai_solution", label: "AI Solution" },
  { value: "branding", label: "Branding" },
  { value: "seo", label: "SEO & Marketing" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "", label: "Select budget range..." },
  { value: "15k-30k", label: "₹15,000 – ₹30,000" },
  { value: "30k-50k", label: "₹30,000 – ₹50,000" },
  { value: "50k-80k", label: "₹50,000 – ₹80,000" },
  { value: "80k-150k", label: "₹80,000 – ₹1,50,000" },
  { value: "150k+", label: "₹1,50,000+" },
];

const sourceOptions = [
  { value: "website", label: "Website" },
  { value: "google", label: "Google Search" },
  { value: "social_media", label: "Social Media" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inquirySchema) as never,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budgetRange: "",
      message: "",
      source: "website",
    },
  });

  const onSubmit = async (data: InquiryInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast({ type: "success", message: "Inquiry submitted successfully! We'll get back to you within 24 hours." });
        reset();
      } else {
        const err = await res.json();
        addToast({ type: "error", message: err.error || "Something went wrong" });
      }
    } catch {
      addToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black font-space mb-4">Let&apos;s Talk</h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Ready to build something great? Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="border-2 border-black shadow-brutal bg-white p-6 md:p-8 space-y-5"
                style={{ borderRadius: "2px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name *"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <Input
                  label="Phone *"
                  type="tel"
                  placeholder="+91 9876543210"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select
                    label="Project Type *"
                    options={projectTypes}
                    error={errors.projectType?.message}
                    {...register("projectType")}
                  />
                  <Select
                    label="Budget Range *"
                    options={budgetRanges}
                    error={errors.budgetRange?.message}
                    {...register("budgetRange")}
                  />
                </div>

                <Textarea
                  label="Tell us about your project *"
                  placeholder="Describe your project, goals, and timeline..."
                  error={errors.message?.message}
                  {...register("message")}
                />

                <Select
                  label="How did you find us?"
                  options={sourceOptions}
                  {...register("source")}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                </Button>
              </form>
            </div>

            {/* Side Info */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/7818832387"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border-2 border-black p-4 bg-green shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                style={{ borderRadius: "2px" }}
              >
                <WhatsappLogo size={32} weight="fill" />
                <div>
                  <p className="font-bold">Chat on WhatsApp</p>
                  <p className="text-sm text-black/60">Quick response guaranteed</p>
                </div>
              </a>

              {/* Contact Info */}
              <div className="border-2 border-black p-6 bg-white shadow-brutal space-y-4" style={{ borderRadius: "2px" }}>
                <h3 className="font-bold font-space text-lg">Contact Info</h3>

                <div className="flex items-start gap-3">
                  <MapPin size={20} weight="fill" className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Address</p>
                    <p className="text-sm text-black/60">Noida, Uttar Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} weight="fill" className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Phone</p>
                    <p className="text-sm text-black/60">+91 7818832387</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Envelope size={20} weight="fill" className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Email</p>
                    <p className="text-sm text-black/60">teamnetnirman@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} weight="fill" className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Business Hours</p>
                    <p className="text-sm text-black/60">Mon - Sat: 9AM - 7PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
