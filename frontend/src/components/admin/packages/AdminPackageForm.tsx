"use client";

import { useEffect, useState } from "react";
import FormField from "@/components/provider-packages/FormField";
import ImageUploadField from "@/components/provider-packages/ImageUploadField";
import type { AdminProvider } from "@/types/admin";
import type { PackagePayload, ProviderPackage } from "@/types/packages";

const blank: PackagePayload = { provider_id: null, title: "", description: "", price: 0, capacity: 0, duration: "", image_url: "", is_available: true, is_active: true };

type Props = {
  providers: AdminProvider[];
  initial?: ProviderPackage | null;
  onSave: (payload: PackagePayload) => Promise<void>;
  onCancel?: () => void;
};

export default function AdminPackageForm({ providers, initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<PackagePayload>(initial ? { ...initial } : blank);

  useEffect(() => {
    setForm(initial ? { ...initial } : blank);
  }, [initial]);

  function update(key: keyof PackagePayload, value: string | boolean) {
    const numeric = ["provider_id", "price", "capacity"];
    const nextValue = numeric.includes(key) && value === "" ? null : value;
    const parsed = nextValue === null ? null : Number(nextValue);
    setForm((current) => ({ ...current, [key]: numeric.includes(key) ? parsed : nextValue }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="grid gap-3 bg-white p-5 shadow-soft md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold text-[#111111]">Provider
        <select required className="border p-3 text-sm" value={form.provider_id ?? ""} onChange={(e) => update("provider_id", e.target.value)}>
          <option value="">Choose provider</option>
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.business_name || provider.provider_name}</option>)}
        </select>
      </label>
      <FormField label="Package Title" required value={form.title} onChange={(value) => update("title", value)} />
      <FormField label="Price" value={form.price ?? ""} onChange={(value) => update("price", value)} />
      <FormField label="Capacity" value={form.capacity ?? ""} onChange={(value) => update("capacity", value)} />
      <FormField label="Duration" value={form.duration ?? ""} onChange={(value) => update("duration", value)} />
      <ImageUploadField image={form.image_url} onChange={(image) => update("image_url", image)} />
      <FormField label="Description" multiline value={form.description ?? ""} onChange={(value) => update("description", value)} />
      <label className="text-sm"><input type="checkbox" checked={form.is_available} onChange={(e) => update("is_available", e.target.checked)} /> Available</label>
      <div className="flex gap-2 md:justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="border px-4 py-2 text-sm font-semibold">Cancel</button>}
        <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
    </form>
  );
}
