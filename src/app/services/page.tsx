"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import * as Icons from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  isVisible: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Failed to fetch services:", err))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.GearSix;
    return <Icon size={120} weight="duotone" />;
  };

  const colors = ["#00FF88", "#7B2FBE", "#FFE600", "#FF3B3B", "#0066FF", "#00FF88"];

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-space mb-4">Our Services</h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              End-to-end digital solutions to take your business from idea to impact.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-black border-t-yellow animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {services.length > 0 ? (
                services.map((service, i) => (
                  <div
                    key={service._id}
                    className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                  >
                    {/* Icon/Visual */}
                    <div
                      className="w-full md:w-1/3 aspect-square border-2 border-black shadow-brutal flex items-center justify-center"
                      style={{ backgroundColor: colors[i % colors.length], borderRadius: "2px" }}
                    >
                      {getIcon(service.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <h2 className="text-2xl md:text-3xl font-black font-space">{service.name}</h2>
                      <p className="text-black/70">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="grid grid-cols-2 gap-2">
                          {service.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm font-medium">
                              <span className="w-2 h-2 bg-black inline-block" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link href="/contact">
                        <Button variant="outline" size="sm">
                          Get Quote <ArrowRight size={14} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border-2 border-black shadow-brutal">
                  <p className="font-bold">No services found. Check back later!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

