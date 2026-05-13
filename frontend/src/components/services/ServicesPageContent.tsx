"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/services/EmptyState";
import QuoteBanner from "@/components/services/QuoteBanner";
import ServiceCategoryList from "@/components/services/ServiceCategoryList";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceSection from "@/components/services/ServiceSection";
import { fetchServiceCategories, fetchServiceProviders } from "@/lib/servicesApi";
import type { ServiceCategory, ServiceFilters as ServiceFilterValues, ServiceProvider } from "@/types/services";

const sections = [
  ["Popular Photographers", "Photographer"],
  ["Trending Designers", "Dress Shop"],
  ["Top Makeup Artists", "Makeup Artist"],
  ["Catering Services", "Catering"],
  ["Wedding Decoration", "Decoration"],
  ["Car Rentals", "Car Rental"],
] as const;

export default function ServicesPageContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filters, setFilters] = useState<ServiceFilterValues>({});
  const [error, setError] = useState("");

  async function load(nextFilters: ServiceFilterValues = filters) {
    try {
      setError("");
      setProviders(await fetchServiceProviders(nextFilters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load services.");
    }
  }

  useEffect(() => {
    const initialFilters = {
      category: searchParams.get("category") || undefined,
      location: searchParams.get("location") || undefined,
    };
    setFilters(initialFilters);
    fetchServiceCategories().then(setCategories).catch(() => setError("Could not load categories."));
    fetchServiceProviders(initialFilters).then(setProviders).catch(() => setError("Could not load services."));
  }, []);

  const locations = useMemo(() => {
    return Array.from(new Set(providers.map((provider) => provider.location).filter(Boolean) as string[])).sort();
  }, [providers]);

  function viewAll() {
    setFilters({});
    load({});
  }

  function viewCategory(category: string) {
    const nextFilters = { category };
    setFilters(nextFilters);
    load(nextFilters);
  }

  return (
    <div className="bg-[#efefef]">
      <ServicesHero />
      <ServiceFilters categories={categories} locations={locations} filters={filters} onChange={setFilters} onSearch={() => load()} />
      <ServiceCategoryList categories={categories} onSelect={viewCategory} onViewAll={viewAll} />
      {error && <EmptyState message={error} />}
      {!error && !providers.length && <EmptyState />}
      {sections.map(([title, category]) => (
        <ServiceSection
          key={category}
          title={title}
          providers={providers.filter((provider) => provider.category_name === category).slice(0, 8)}
          onViewAll={() => viewCategory(category)}
        />
      ))}
      <QuoteBanner />
    </div>
  );
}
