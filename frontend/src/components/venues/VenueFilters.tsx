import type { VenueFilters } from "@/types/services";

type VenueFiltersProps = {
  filters: VenueFilters;
  locations: string[];
  onChange: (filters: VenueFilters) => void;
  onSearch: () => void;
  onViewAll: () => void;
};

const ratings = ["4", "4.5", "5"];

export default function VenueFilters(props: VenueFiltersProps) {
  const { filters, locations, onChange, onSearch, onViewAll } = props;
  const update = (key: keyof VenueFilters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <section className="bg-[#efefef] px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <input value={filters.guests || ""} onChange={(event) => update("guests", event.target.value)} className={fieldClass} placeholder="No. of Guests" />
        <input value={filters.venue_type || ""} onChange={(event) => update("venue_type", event.target.value)} className={fieldClass} placeholder="Venue Type" />
        <select value={filters.location || ""} onChange={(event) => update("location", event.target.value)} className={fieldClass}>
          <option value="">Location</option>
          {locations.map((location) => <option key={location}>{location}</option>)}
        </select>
        <select value={filters.rating || ""} onChange={(event) => update("rating", event.target.value)} className={fieldClass}>
          <option value="">Rate</option>
          {ratings.map((rating) => <option key={rating} value={rating}>{rating}+ stars</option>)}
        </select>
      </div>
      <div className="mt-7 flex justify-center gap-3">
        <button className="rounded-full bg-black px-10 py-3 font-semibold text-white" type="button" onClick={onSearch}>Search</button>
        <button className="rounded-full border border-black px-10 py-3 font-semibold text-black" type="button" onClick={onViewAll}>View All</button>
      </div>
    </section>
  );
}

const fieldClass = "h-14 rounded-2xl border-2 border-[#111] bg-transparent px-5 text-sm text-stone-700 outline-none";
