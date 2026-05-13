"use client";

import { useState } from "react";
import type { WeddingPackage, WeddingPackagePayload } from "@/types/packages";

const blank: WeddingPackagePayload = { title: "", description: "", total_price: 0, image_url: "", guest_capacity: 0, is_active: true };

type Props = {
  initial?: WeddingPackage | null;
  onSave: (payload: WeddingPackagePayload) => Promise<void>;
  onCancel?: () => void;
};

export default function AdminWeddingPackageForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<WeddingPackagePayload>(initial ? { ...initial } : blank);

  function update(key: keyof WeddingPackagePayload, value: string | boolean) {
    const numeric = ["total_price", "guest_capacity"];
    setForm((current) => ({ ...current, [key]: numeric.includes(key) ? Number(value) : value }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="grid gap-3 bg-white p-5 shadow-soft md:grid-cols-2">
      <input required className="border p-3 text-sm" placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} />
      <input className="border p-3 text-sm" type="number" placeholder="Total price" value={form.total_price} onChange={(e) => update("total_price", e.target.value)} />
      <input className="border p-3 text-sm" type="number" placeholder="Guest capacity" value={form.guest_capacity ?? 0} onChange={(e) => update("guest_capacity", e.target.value)} />
      <input className="border p-3 text-sm" placeholder="Image URL" value={form.image_url ?? ""} onChange={(e) => update("image_url", e.target.value)} />
      <textarea className="border p-3 text-sm md:col-span-2" placeholder="Description" value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} />
      <label className="text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => update("is_active", e.target.checked)} /> Active public package</label>
      <div className="flex gap-2 md:justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="border px-4 py-2 text-sm font-semibold">Cancel</button>}
        <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
    </form>
  );
}
