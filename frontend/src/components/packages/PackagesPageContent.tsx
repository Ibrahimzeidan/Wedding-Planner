"use client";

import { useEffect, useState } from "react";
import PackageFilters from "@/components/packages/PackageFilters";
import PackageGrid from "@/components/packages/PackageGrid";
import WeddingHero from "@/components/ui/WeddingHero";
import { fetchWeddingPackages, type PublicPackageFilters } from "@/lib/packagesApi";
import type { WeddingPackage } from "@/types/packages";

const heroImage = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=85";

export default function PackagesPageContent() {
  const [packages, setPackages] = useState<WeddingPackage[]>([]);
  const [filters, setFilters] = useState<PublicPackageFilters>({});
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setPackages(await fetchWeddingPackages(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load packages.");
    }
  }

  useEffect(() => { fetchWeddingPackages().then(setPackages).catch(() => setError("Could not load packages.")); }, []);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <WeddingHero image={heroImage} title="Wedding Packages" />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-2xl text-stone-600">
          Ready-made packages combining venues, photographers, catering, decoration, and more.
        </p>
      </section>
      <PackageFilters filters={filters} onChange={setFilters} onSearch={load} />
      {error ? <p className="mx-auto max-w-6xl px-4 text-sm text-red-700">{error}</p> : <PackageGrid packages={packages} />}
    </div>
  );
}
