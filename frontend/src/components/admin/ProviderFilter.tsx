import type { AdminCategory } from "@/types/admin";

type ProviderFilterProps = {
  categories: AdminCategory[];
  value: string;
  onChange: (value: string) => void;
};

export default function ProviderFilter({ categories, value, onChange }: ProviderFilterProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111] sm:max-w-xs">
      Filter by category
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-[#111111]/15 bg-white px-4 py-3 outline-none focus:border-[#111111]"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}
