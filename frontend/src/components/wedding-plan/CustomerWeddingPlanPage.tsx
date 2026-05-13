"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import WeddingPlanCard from "@/components/wedding-plan/WeddingPlanCard";
import WeddingPlanForm from "@/components/wedding-plan/WeddingPlanForm";
import { createWeddingPlan, deleteWeddingPlan, getMyWeddingPlan, updateWeddingPlan } from "@/lib/weddingPlanApi";
import type { WeddingPlan, WeddingPlanPayload } from "@/types/weddingPlan";

export default function CustomerWeddingPlanPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => <WeddingPlanBody />}
    </ProtectedRoute>
  );
}
function WeddingPlanBody() {
  const [plan, setPlan] = useState<WeddingPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyWeddingPlan()
      .then(setPlan)
      .catch((error) => setMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function save(payload: WeddingPlanPayload) {
    try {
      setIsSaving(true);
      const savedPlan = plan
        ? await updateWeddingPlan(plan.id, payload)
        : await createWeddingPlan(payload);
      setPlan(savedPlan);
      setIsFormOpen(false);
      setMessage("Wedding plan saved.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function remove() {
    if (!plan || !window.confirm("Delete this wedding plan?")) return;
    try {
      await deleteWeddingPlan(plan.id);
      setPlan(null);
      setMessage("Wedding plan deleted.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 border border-[#111111]/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Wedding Plan</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Create, edit, and revisit your wedding date, budget, location, style, and service needs.
          </p>
        </div>
        {message && <p className="mb-4 bg-white p-3 text-sm text-stone-700 shadow-soft">{message}</p>}
        {isLoading && <p className="text-sm text-stone-600">Loading wedding plan...</p>}
        {!isLoading && !plan && !isFormOpen && (
          <button onClick={() => setIsFormOpen(true)}
            className="rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white">
            Create Wedding Plan
          </button>
        )}
        {isFormOpen && (
          <WeddingPlanForm
            initial={plan}
            isSaving={isSaving}
            onCancel={() => setIsFormOpen(false)}
            onSave={save}
          />
        )}
        {!isLoading && plan && !isFormOpen && (
          <WeddingPlanCard plan={plan} onDelete={remove} onEdit={() => setIsFormOpen(true)} />
        )}
      </section>
    </main>
  );
}
