import Link from "next/link";
import { CalendarDays, Heart, PlusCircle } from "lucide-react";
import type { WeddingPlan } from "@/types/weddingPlan";

type Props = {
  favoriteCount: number;
  plan: WeddingPlan | null;
};

export default function WeddingPlanSummary({ favoriteCount, plan }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="border border-[#111111]/10 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-[#111111]">Wedding Plan Summary</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {plan
            ? `${plan.wedding_style || "Wedding"} plan for ${plan.wedding_date || "a date to be set"}`
            : "Create your plan to track your date, budget, location, and services."}
        </p>
      </article>
      <article className="border border-[#111111]/10 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-[#111111]">Favorites</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          You have {favoriteCount} favorite provider{favoriteCount === 1 ? "" : "s"} saved.
        </p>
      </article>
      <div className="flex flex-col gap-2 lg:col-span-2 sm:flex-row">
        <Link href="/dashboard/customer/wedding-plan" className="rounded-full bg-[#111111] px-5 py-3 text-center text-sm font-semibold text-white">
          <PlusCircle className="mr-2 inline h-4 w-4" /> {plan ? "Edit Wedding Plan" : "Create Wedding Plan"}
        </Link>
        <Link href="/dashboard/customer/favorites" className="rounded-full border px-5 py-3 text-center text-sm font-semibold">
          View Favorites
        </Link>
        <Link href="/services" className="rounded-full border px-5 py-3 text-center text-sm font-semibold">
          Browse Services
        </Link>
      </div>
    </section>
  );
}
