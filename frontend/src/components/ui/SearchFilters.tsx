"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const categories = ["Wedding Hall", "Photographer", "Catering", "Decoration", "Makeup Artist", "DJ / Music", "Dress Shop", "Car Rental", "Choreographer"];
const locations = ["Beirut", "Jounieh", "Byblos", "Saida", "Tripoli", "Zahle"];

export default function SearchFilters() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  function search() {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    router.push(`/services${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="bg-[#efefef] px-4 py-12">
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        <Select label="select Category" value={category} options={categories} onChange={setCategory} />
        <Select label="Select Location" value={location} options={locations} onChange={setLocation} />
      </div>
      <div className="mt-7 flex justify-center">
        <button onClick={search} className="rounded-full bg-black px-12 py-3 font-semibold text-white" type="button">
          Search
        </button>
      </div>
    </section>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="flex h-14 rounded-2xl border-2 border-[#111] bg-transparent px-6 text-sm text-stone-600 outline-none"
    >
      <option value="">{label}</option>
      {options.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  );
}
