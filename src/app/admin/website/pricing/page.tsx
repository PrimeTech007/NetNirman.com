"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/useUIStore";
import { Plus, Pencil, Trash, Check } from "@phosphor-icons/react";

interface PricingPlan {
  name: string;
  priceRange: string;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function PricingCMSPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"plans" | "faq">("plans");

  // plan modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanIdx, setEditingPlanIdx] = useState<number | null>(null);
  const [planForm, setPlanForm] = useState<PricingPlan>({
    name: "",
    priceRange: "",
    description: "",
    features: [],
    isPopular: false,
  });
  const [featureInput, setFeatureInput] = useState("");

  // faq modal
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<FAQItem>({ question: "", answer: "" });

  const { addToast } = useUIStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (data.pricing_plans?.value) setPlans(data.pricing_plans.value);
      if (data.faq?.value) setFaq(data.faq.value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: unknown) => {
    await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  // Plan CRUD
  const openNewPlan = () => {
    setEditingPlanIdx(null);
    setPlanForm({ name: "", priceRange: "", description: "", features: [], isPopular: false });
    setFeatureInput("");
    setShowPlanModal(true);
  };

  const openEditPlan = (idx: number) => {
    setEditingPlanIdx(idx);
    setPlanForm({ ...plans[idx] });
    setFeatureInput("");
    setShowPlanModal(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setPlanForm((p) => ({ ...p, features: [...p.features, featureInput.trim()] }));
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    setPlanForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
  };

  const savePlan = async () => {
    if (!planForm.name) return;
    const updated = editingPlanIdx !== null
      ? plans.map((p, i) => (i === editingPlanIdx ? planForm : p))
      : [...plans, planForm];
    setPlans(updated);
    await saveSetting("pricing_plans", updated);
    addToast({ type: "success", message: "Plans saved!" });
    setShowPlanModal(false);
  };

  const deletePlan = async (idx: number) => {
    if (!confirm("Delete this plan?")) return;
    const updated = plans.filter((_, i) => i !== idx);
    setPlans(updated);
    await saveSetting("pricing_plans", updated);
    addToast({ type: "success", message: "Deleted" });
  };

  // FAQ CRUD
  const openNewFaq = () => {
    setEditingFaqIdx(null);
    setFaqForm({ question: "", answer: "" });
    setShowFaqModal(true);
  };

  const openEditFaq = (idx: number) => {
    setEditingFaqIdx(idx);
    setFaqForm({ ...faq[idx] });
    setShowFaqModal(true);
  };

  const saveFaq = async () => {
    if (!faqForm.question) return;
    const updated = editingFaqIdx !== null
      ? faq.map((f, i) => (i === editingFaqIdx ? faqForm : f))
      : [...faq, faqForm];
    setFaq(updated);
    await saveSetting("faq", updated);
    addToast({ type: "success", message: "FAQ saved!" });
    setShowFaqModal(false);
  };

  const deleteFaq = async (idx: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const updated = faq.filter((_, i) => i !== idx);
    setFaq(updated);
    await saveSetting("faq", updated);
    addToast({ type: "success", message: "Deleted" });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-space">Pricing CMS</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("plans")}
          className={`px-4 py-2 font-bold text-sm border-2 border-black cursor-pointer ${
            tab === "plans" ? "bg-yellow" : "bg-white"
          }`}
          style={{ borderRadius: "2px" }}
        >
          Pricing Plans
        </button>
        <button
          onClick={() => setTab("faq")}
          className={`px-4 py-2 font-bold text-sm border-2 border-black cursor-pointer ${
            tab === "faq" ? "bg-yellow" : "bg-white"
          }`}
          style={{ borderRadius: "2px" }}
        >
          FAQ
        </button>
      </div>

      {/* Plans Tab */}
      {tab === "plans" && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={openNewPlan}>
              <Plus size={14} className="mr-1" /> Add Plan
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="border-2 border-black shadow-brutal bg-white p-4 space-y-3"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-black font-space text-lg">{plan.name}</h3>
                  {plan.isPopular && (
                    <span className="bg-green text-black text-xs font-bold px-2 py-0.5 border border-black" style={{ borderRadius: "2px" }}>
                      POPULAR
                    </span>
                  )}
                </div>
                <p className="text-xl font-black">{plan.priceRange}</p>
                <p className="text-sm text-black/60">{plan.description}</p>
                <ul className="space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm flex items-center gap-1">
                      <Check size={14} className="text-green flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => openEditPlan(idx)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deletePlan(idx)}>
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FAQ Tab */}
      {tab === "faq" && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={openNewFaq}>
              <Plus size={14} className="mr-1" /> Add FAQ
            </Button>
          </div>
          <div className="space-y-2">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="border-2 border-black bg-white p-4 flex items-start justify-between gap-4"
                style={{ borderRadius: "2px" }}
              >
                <div>
                  <p className="font-bold">{item.question}</p>
                  <p className="text-sm text-black/60 mt-1">{item.answer}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEditFaq(idx)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteFaq(idx)}>
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Plan Modal */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title={editingPlanIdx !== null ? "Edit Plan" : "New Plan"}>
        <div className="space-y-4">
          <Input label="Plan Name" value={planForm.name} onChange={(e) => setPlanForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Price Range" value={planForm.priceRange} onChange={(e) => setPlanForm((p) => ({ ...p, priceRange: e.target.value }))} />
          <Textarea label="Description" value={planForm.description} onChange={(e) => setPlanForm((p) => ({ ...p, description: e.target.value }))} rows={2} />
          <div>
            <label className="text-xs font-bold uppercase mb-1 block">Features</label>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature..." />
              <Button size="sm" onClick={addFeature}><Plus size={14} /></Button>
            </div>
            <div className="mt-2 space-y-1">
              {planForm.features.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-cream px-2 py-1 border border-black/10 text-sm" style={{ borderRadius: "2px" }}>
                  <span>{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-red cursor-pointer"><Trash size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={planForm.isPopular} onChange={(e) => setPlanForm((p) => ({ ...p, isPopular: e.target.checked }))} />
            <span className="text-sm font-bold">Mark as Popular</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowPlanModal(false)}>Cancel</Button>
            <Button onClick={savePlan}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* FAQ Modal */}
      <Modal isOpen={showFaqModal} onClose={() => setShowFaqModal(false)} title={editingFaqIdx !== null ? "Edit FAQ" : "New FAQ"}>
        <div className="space-y-4">
          <Input label="Question" value={faqForm.question} onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))} />
          <Textarea label="Answer" value={faqForm.answer} onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))} rows={4} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowFaqModal(false)}>Cancel</Button>
            <Button onClick={saveFaq}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
