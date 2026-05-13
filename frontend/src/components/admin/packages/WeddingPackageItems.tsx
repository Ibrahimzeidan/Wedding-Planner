"use client";

import { useState } from "react";
import type { AdminProvider } from "@/types/admin";
import type { WeddingItemPayload, WeddingPackage } from "@/types/packages";

type Props = {
  item: WeddingPackage | null;
  providers: AdminProvider[];
  onAdd: (payload: WeddingItemPayload) => Promise<void>;
  onDelete: (itemId: number) => Promise<void>;
};

export default function WeddingPackageItems({ item, providers, onAdd, onDelete }: Props) {
  const [form, setForm] = useState<WeddingItemPayload>({ service_provider_id: 0, service_package_id: null, category_name: "", item_price: 0 });
  if (!item) return <div className="bg-white p-5 text-sm text-stone-600 shadow-soft">Select a wedding package to manage included services.</div>;

  return (
    <div className="bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">{item.title} items</h2>
      <form onSubmit={(e) => { e.preventDefault(); onAdd(form); }} className="mt-4 grid gap-3 md:grid-cols-4">
        <select required className="border p-3 text-sm" value={form.service_provider_id || ""} onChange={(e) => setForm({ ...form, service_provider_id: Number(e.target.value) })}>
          <option value="">Provider</option>
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.business_name || provider.provider_name}</option>)}
        </select>
        <input className="border p-3 text-sm" placeholder="Category" value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} />
        <input className="border p-3 text-sm" type="number" placeholder="Item price" value={form.item_price} onChange={(e) => setForm({ ...form, item_price: Number(e.target.value) })} />
        <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Add Item</button>
      </form>
      <div className="mt-4 space-y-2">
        {item.items.map((part) => (
          <div key={part.id} className="flex items-center justify-between border p-3 text-sm">
            <span>{part.provider_name || part.service_provider_id} - {part.category_name}</span>
            <button onClick={() => onDelete(part.id)} className="border px-3 py-1">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
