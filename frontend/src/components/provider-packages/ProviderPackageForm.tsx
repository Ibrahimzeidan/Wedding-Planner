"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import FormField from "@/components/provider-packages/FormField";
import ImageUploadField from "@/components/provider-packages/ImageUploadField";
import type { PackagePayload, ProviderPackage } from "@/types/packages";

const blank: PackagePayload = { title: "", description: "", price: 0, capacity: 0, duration: "", image_url: "", is_available: true };

type Props = {
  initial?: ProviderPackage | null;
  onSave: (payload: PackagePayload) => Promise<void>;
  onCancel?: () => void;
};

export default function ProviderPackageForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<PackagePayload>(initial ? { ...initial } : blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...initial } : blank);
  }, [initial]);

  function setValue(key: keyof PackagePayload, value: string | boolean) {
    const numberKeys = ["price", "capacity"];
    const nextValue = numberKeys.includes(key) && value === "" ? null : value;
    const parsed = nextValue === null ? null : Number(nextValue);
    setForm((current) => ({ ...current, [key]: numberKeys.includes(key) ? parsed : nextValue }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    if (!initial) setForm(blank);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-2">
      <FormField label="Package Title" required value={form.title} onChange={(value) => setValue("title", value)} />
      <FormField label="Price" value={form.price ?? ""} onChange={(value) => setValue("price", value)} />
      <FormField label="Capacity" value={form.capacity ?? ""} onChange={(value) => setValue("capacity", value)} />
      <FormField label="Duration" value={form.duration ?? ""} onChange={(value) => setValue("duration", value)} />
      <ImageUploadField image={form.image_url} onChange={(image) => setValue("image_url", image)} />
      <FormField label="Description" multiline value={form.description ?? ""} onChange={(value) => setValue("description", value)} />
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={form.is_available} onChange={(e) => setValue("is_available", e.target.checked)} />
        Available
      </label>
      <div className="flex gap-2 md:justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="border px-4 py-2 text-sm font-semibold">Cancel</button>}
        <button disabled={saving} className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
          {saving ? "Saving..." : "Save Package"}
        </button>
      </div>
    </form>
  );
}
