"use client";

import { useEffect, useState } from "react";
import { apiBaseUrl } from "@/lib/auth";

type ServiceCategory = {
  id: number;
  name: string;
};

type ServiceCategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ServiceCategorySelect({ value, onChange }: ServiceCategorySelectProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/service-categories`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => setCategories(items.filter((item: ServiceCategory) => item.name !== "Venue Planner")))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      Service Category
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full min-w-0 border-0 border-b border-[#111111]/25 bg-transparent px-0 py-3 text-[#111111] outline-none transition focus:border-[#111111]"
      >
        <option value="">{isLoading ? "Loading categories..." : "Choose a category"}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}
