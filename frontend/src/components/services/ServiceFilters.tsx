import type { ServiceCategory, ServiceFilters } from "@/types/services";

type ServiceFiltersProps = {
  categories: ServiceCategory[];
  locations: string[];
  filters: ServiceFilters;
  onChange: (filters: ServiceFilters) => void;
  onSearch: () => void;
};

const ratings = ["4", "4.5", "5"];

export default function ServiceFilters(props: ServiceFiltersProps) {
  const { categories, locations, filters, onChange, onSearch } = props;
  const update = (key: keyof ServiceFilters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <section className="bg-[#efefef] px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={filters.search || ""}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Search provider, category, location"
          className={selectClass}
        />
        <select value={filters.category || ""} onChange={(event) => update("category", event.target.value)} className={selectClass}>
          <option value="">Select Category</option>
          {categories.map((category) => <option key={category.id}>{category.name}</option>)}
        </select>
        <select value={filters.location || ""} onChange={(event) => update("location", event.target.value)} className={selectClass}>
          <option value="">Select Location</option>
          {locations.map((location) => <option key={location}>{location}</option>)}
        </select>
        <select value={filters.rating || ""} onChange={(event) => update("rating", event.target.value)} className={selectClass}>
          <option value="">Rate</option>
          {ratings.map((rating) => <option key={rating} value={rating}>{rating}+ stars</option>)}
        </select>
      </div>
      <div className="mt-7 flex justify-center">
        <button className="rounded-full bg-black px-12 py-3 font-semibold text-white" type="button" onClick={onSearch}>
          Search
        </button>
      </div>
    </section>
  );
}

const selectClass = [
  "h-14 rounded-2xl border-2 border-[#111] bg-transparent px-5",
  "text-sm text-stone-700 outline-none transition focus:bg-white",
].join(" ");
