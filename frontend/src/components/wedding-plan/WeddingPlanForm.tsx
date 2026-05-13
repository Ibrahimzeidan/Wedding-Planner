"use client";

import { type FormEvent, useEffect, useState } from "react";
import WeddingPlanFields from "@/components/wedding-plan/WeddingPlanFields";
import type { WeddingPlan, WeddingPlanPayload } from "@/types/weddingPlan";

type Props = {
  initial?: WeddingPlan | null;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (payload: WeddingPlanPayload) => void;
};

const emptyPlan: WeddingPlanPayload = {
  wedding_date: "",
  budget: null,
  guest_count: null,
  location: "",
  wedding_style: "",
  preferred_services: [],
};

function toDraft(plan?: WeddingPlan | null): WeddingPlanPayload {
  if (!plan) return emptyPlan;
  return {
    wedding_date: plan.wedding_date ?? "",
    budget: plan.budget ?? null,
    guest_count: plan.guest_count ?? null,
    location: plan.location ?? "",
    wedding_style: plan.wedding_style ?? "",
    preferred_services: plan.preferred_services ?? [],
  };
}

export default function WeddingPlanForm({ initial, isSaving, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<WeddingPlanPayload>(() => toDraft(initial));
  useEffect(() => setDraft(toDraft(initial)), [initial]);

  function update<K extends keyof WeddingPlanPayload>(field: K, value: WeddingPlanPayload[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function toggleService(service: string) {
    setDraft((current) => {
      const services = current.preferred_services.includes(service)
        ? current.preferred_services.filter((item) => item !== service)
        : [...current.preferred_services, service];
      return { ...current, preferred_services: services };
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      ...draft,
      wedding_date: draft.wedding_date || null,
      budget: draft.budget ?? null,
      guest_count: draft.guest_count ?? null,
      location: draft.location || null,
      wedding_style: draft.wedding_style || null,
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
      <WeddingPlanFields draft={draft} onToggle={toggleService} onUpdate={update} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <button disabled={isSaving} className="rounded-full bg-[#111111] px-5 py-3 font-semibold text-white">
          {isSaving ? "Saving..." : "Save Plan"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border px-5 py-3 font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}
