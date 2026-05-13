"use client";

import type { CustomerPayload } from "@/types/admin";

type Props = {
  draft: CustomerPayload;
  isSaving: boolean;
  onCancel: () => void;
  onChange: (draft: CustomerPayload) => void;
  onSubmit: () => void;
};

export default function CustomerForm({ draft, isSaving, onCancel, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
      className="grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-2">
      <Field label="Full name" value={draft.full_name ?? ""}
        onChange={(full_name) => onChange({ ...draft, full_name })} />
      <Field label="Email" value={draft.email ?? ""}
        onChange={(email) => onChange({ ...draft, email })} />
      <Field label="Phone" value={draft.phone ?? ""}
        onChange={(phone) => onChange({ ...draft, phone })} />
      <Field label="Address" value={draft.address ?? ""}
        onChange={(address) => onChange({ ...draft, address })} />
      <Field label="Location" value={draft.location ?? ""}
        onChange={(location) => onChange({ ...draft, location })} />
      <Field label="Guest count" value={String(draft.guest_count ?? "")}
        onChange={(value) => onChange({ ...draft, guest_count: Number(value) || null })} />
      <Field label="Budget" value={String(draft.budget ?? "")}
        onChange={(value) => onChange({ ...draft, budget: Number(value) || null })} />
      <label className="flex items-center gap-3 text-sm font-semibold text-[#111111]">
        <input type="checkbox" checked={draft.is_active !== false}
          onChange={(event) => onChange({ ...draft, is_active: event.target.checked })} />
        Active customer
      </label>
      <div className="flex gap-2 md:col-span-2 md:justify-end">
        <button type="button" onClick={onCancel} className="border px-4 py-2 text-sm font-semibold">Cancel</button>
        <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Customer"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange }: {
  label: string; value: string; onChange: (value: string) => void;
}) {
  return <label className="grid gap-2 text-sm font-semibold text-[#111111]">{label}
    <input value={value} onChange={(event) => onChange(event.target.value)}
      className="border border-[#111111]/15 px-3 py-2 outline-none focus:border-[#111111]" />
  </label>;
}
