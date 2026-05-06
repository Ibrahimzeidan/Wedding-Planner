import Image from "next/image";
import { CalendarDays, HeartHandshake, MapPin, Sparkles, type LucideIcon } from "lucide-react";

const planDetails = [
  { label: "Budget", value: "$18k" },
  { label: "Guests", value: "140" },
  { label: "Style", value: "Elegant" },
];

export default function HeroPreview() {
  return (
    <figure className="mx-auto w-full max-w-lg overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="relative min-h-[320px] bg-[linear-gradient(135deg,#fff7f9_0%,#fff8e7_52%,#ffffff_100%)] p-5 sm:min-h-[360px] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-champagne-300 sm:h-16 sm:w-16">
            <Image src="/images/logo.jpeg" alt="Smart Wedding Planner logo" width={64} height={64} className="h-full w-full object-cover" priority />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-champagne-700 shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI Match
          </span>
        </div>
        <div className="mt-10 max-w-sm sm:mt-14">
          <p className="text-sm font-semibold uppercase text-stone-500">
            Wedding plan
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-950 sm:text-3xl">
            A refined plan in one place
          </h2>
          <p className="mt-4 leading-7 text-stone-600">
            Compare services, update details, and keep your dream day moving forward.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {planDetails.map((item) => (
            <div key={item.label} className="border-t border-champagne-300 pt-3">
              <p className="text-xs font-semibold uppercase text-stone-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-stone-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 border-t border-[#111111]/10 p-5 sm:grid-cols-2">
        <HeroFeature icon={CalendarDays} text="Timeline ready" />
        <HeroFeature icon={HeartHandshake} text="Trusted providers" />
        <HeroFeature icon={MapPin} text="Recommendations by location and preferences" wide />
      </div>
    </figure>
  );
}

function HeroFeature({ icon: Icon, text, wide }: { icon: LucideIcon; text: string; wide?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${wide ? "sm:col-span-2" : ""}`}>
      <Icon className="h-5 w-5 text-[#111111]" aria-hidden="true" />
      <span className="text-sm font-medium text-stone-700">{text}</span>
    </div>
  );
}
