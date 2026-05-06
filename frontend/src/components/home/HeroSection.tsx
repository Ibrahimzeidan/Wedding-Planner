import { ChevronDown, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

const heroImage =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[720px] overflow-hidden bg-[#111111] text-white"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.18)), url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-white/75">wedding events</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            Happily Ever After starts here
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Plan venues, providers, categories, bookings, and dashboards in one elegant wedding platform.
          </p>
        </div>
        <div className="mt-10 grid max-w-4xl gap-3 bg-white/95 p-3 text-[#111111] shadow-soft sm:grid-cols-[1fr_1fr_auto]">
          <HeroSelect label="Select Category" />
          <HeroSelect label="Location" icon={<MapPin size={16} />} />
          <Button href="/register" className="w-full sm:w-auto">Search</Button>
        </div>
      </div>
    </section>
  );
}

function HeroSelect({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between border border-[#111111]/20 px-4 text-sm text-stone-500">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ChevronDown size={16} />
    </div>
  );
}
