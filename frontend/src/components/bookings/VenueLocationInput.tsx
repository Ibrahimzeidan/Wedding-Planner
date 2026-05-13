"use client";

import { useEffect, useState } from "react";
import { fetchVenues } from "@/lib/servicesApi";
import type { ServiceProvider } from "@/types/services";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function VenueLocationInput({ value, onChange }: Props) {
  const [venues, setVenues] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    fetchVenues().then(setVenues).catch(() => setVenues([]));
  }, []);

  return (
    <label className="text-sm font-semibold text-stone-800">
      Wedding Venue
      <input
        required
        list="booking-venues"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Choose or type the venue name and location"
        className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
      />
      <datalist id="booking-venues">
        {venues.map((venue) => (
          <option
            key={venue.id}
            value={`${venue.business_name || venue.full_name} - ${venue.location || "Venue"}`}
          />
        ))}
      </datalist>
    </label>
  );
}
