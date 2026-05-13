"use client";

import { useState } from "react";
import type { AdminCategory, AdminProvider, ProviderPayload } from "@/types/admin";

type Props = {
  provider: AdminProvider;
  categories: AdminCategory[];
  onSave: (payload: ProviderPayload) => Promise<void>;
  onCancel: () => void;
};

export default function ProviderEditForm({ provider, categories, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    category_id: String(provider.category_id ?? ""),
    business_name: provider.business_name ?? "",
    description: provider.description ?? "",
    location: provider.location ?? "",
    phone: provider.phone ?? "",
    rating: String(provider.rating ?? ""),
    is_approved: provider.is_approved,
    is_active: provider.is_active,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ ...form, category_id: Number(form.category_id) || null, rating: Number(form.rating) || null });
      }}
      className="grid gap-3 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-2"
    >
      <select className="border p-3 text-sm" value={form.category_id}
        onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
        <option value="">Uncategorized</option>
        {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <input className="border p-3 text-sm" value={form.business_name}
        onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="Business name" />
      <input className="border p-3 text-sm" value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
      <input className="border p-3 text-sm" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
      <input className="border p-3 text-sm" value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="Rating" />
      <textarea className="border p-3 text-sm md:col-span-2" value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.is_approved}
          onChange={(e) => setForm({ ...form, is_approved: e.target.checked })} />
        Approved
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        Active
      </label>
      <div className="flex gap-2 md:col-span-2 md:justify-end">
        <button type="button" onClick={onCancel} className="border px-4 py-2 text-sm font-semibold">Cancel</button>
        <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Save Provider</button>
      </div>
    </form>
  );
}
