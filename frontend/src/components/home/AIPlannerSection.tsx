import Link from "next/link";
import { CalendarDays, MapPin, SlidersHorizontal, Users, WalletCards, WandSparkles } from "lucide-react";

const recommendationInputs = [
  { label: "Budget", icon: WalletCards },
  { label: "Number of guests", icon: Users },
  { label: "Date", icon: CalendarDays },
  { label: "Location", icon: MapPin },
  { label: "Preferences", icon: SlidersHorizontal },
];

export default function AIPlannerSection() {
  return (
    <section className="bg-[#111111] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase text-white/55">AI planner</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Smart recommendations that adjust with your wedding
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">
            The AI planner recommends venues, catering, photographers, decorations, and other services
            based on your wedding details. When you change the guest count, budget, date, or location,
            the plan updates automatically so your options stay relevant.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition hover:bg-event-paper sm:w-auto"
          >
            <WandSparkles className="h-5 w-5" aria-hidden="true" />
            Try AI Planner
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {recommendationInputs.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex min-h-14 items-center gap-3 border border-white/15 bg-white/5 px-4 py-4 text-white"
              >
                <Icon className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
