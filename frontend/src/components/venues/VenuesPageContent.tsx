"use client";

import { useEffect, useMemo, useState } from "react";
import QuoteBannerBase from "@/components/ui/QuoteBanner";
import VenueFilters from "@/components/venues/VenueFilters";
import VenueGrid from "@/components/venues/VenueGrid";
import VenueHero from "@/components/venues/VenueHero";
import { fetchVenues } from "@/lib/servicesApi";
import type { ServiceProvider, VenueFilters as VenueFilterValues } from "@/types/services";

const quoteImage = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=85";

export default function VenuesPageContent() {
  const [venues, setVenues] = useState<ServiceProvider[]>([]);
  const [filters, setFilters] = useState<VenueFilterValues>({});

  async function load(nextFilters: VenueFilterValues = filters) {
    setVenues(await fetchVenues(nextFilters));
  }

  useEffect(() => {
    fetchVenues().then(setVenues).catch(() => setVenues([]));
  }, []);

  const locations = useMemo(() => {
    return Array.from(new Set(venues.map((venue) => venue.location).filter(Boolean) as string[])).sort();
  }, [venues]);

  function viewAll() {
    setFilters({});
    load({});
  }

  return (
    <div className="bg-[#efefef]">
      <VenueHero />
      <VenueFilters
        filters={filters}
        locations={locations}
        onChange={setFilters}
        onSearch={() => load()}
        onViewAll={viewAll}
      />
      <VenueGrid venues={venues} />
      <QuoteBannerBase image={quoteImage} />
    </div>
  );
}
