import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <section className="bg-cream section-padding">
        <div className="max-w-4xl mx-auto">
          <Link href="/work" className="text-sm font-bold underline mb-8 inline-block">
            &larr; Back to Work
          </Link>

          <div className="border-2 border-black shadow-brutal bg-white mb-8" style={{ borderRadius: "2px" }}>
            <div className="h-64 bg-yellow flex items-center justify-center text-8xl border-b-2 border-black">
              🖥️
            </div>
            <div className="p-8">
              <Badge color="#00FF88">CASE STUDY</Badge>
              <h1 className="text-3xl md:text-5xl font-black font-space mt-4 mb-4">
                {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </h1>

              <div className="space-y-8 mt-8">
                <div>
                  <h2 className="text-xl font-bold font-space mb-2">The Problem</h2>
                  <p className="text-black/70">
                    The client needed a modern digital solution to streamline their operations
                    and improve customer engagement. Their existing systems were outdated and
                    couldn&apos;t scale with their growing user base.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold font-space mb-2">Our Solution</h2>
                  <p className="text-black/70">
                    We designed and developed a comprehensive platform using Next.js, Node.js,
                    and MongoDB. The solution included a responsive web application, admin
                    dashboard, and API integrations.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold font-space mb-2">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "AWS"].map((t) => (
                      <Badge key={t} color="#F5F0E8">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold font-space mb-2">Results</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: "200%", label: "Traffic Increase" },
                      { value: "3x", label: "Conversion Rate" },
                      { value: "50%", label: "Cost Reduction" },
                      { value: "99.9%", label: "Uptime" },
                    ].map((r) => (
                      <div key={r.label} className="border-2 border-black p-4 text-center bg-cream" style={{ borderRadius: "2px" }}>
                        <div className="text-2xl font-black font-space">{r.value}</div>
                        <div className="text-xs text-black/60 mt-1">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact">
              <Button size="lg">START YOUR PROJECT</Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 60;
