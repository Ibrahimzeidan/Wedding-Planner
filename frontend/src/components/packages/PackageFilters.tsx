"use client";

import type { PublicPackageFilters } from "@/lib/packagesApi";

type Props = {
  filters: PublicPackageFilters;
  onChange: (filters: PublicPackageFilters) => void;
  onSearch: () => void;
};

export default function PackageFilters({ filters, onChange, onSearch }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-3 bg-white p-5 shadow-soft md:grid-cols-4">
        <input className="border p-3 text-sm" placeholder="Min price" value={filters.min_price ?? ""} onChange={(e) => onChange({ ...filters, min_price: e.target.value })} />
        <input className="border p-3 text-sm" placeholder="Max price" value={filters.max_price ?? ""} onChange={(e) => onChange({ ...filters, max_price: e.target.value })} />
        <input className="border p-3 text-sm" placeholder="Guests" value={filters.guests ?? ""} onChange={(e) => onChange({ ...filters, guests: e.target.value })} />
        <button onClick={onSearch} className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Filter</button>
      </div>
    </section>
  );
}
