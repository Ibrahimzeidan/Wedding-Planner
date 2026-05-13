import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, Users } from "lucide-react";
import type { WeddingPlan } from "@/types/weddingPlan";

type Props = {
  plan: WeddingPlan;
  onDelete: () => void;
  onEdit: () => void;
};

function money(value?: number | null) {
  return value ? `$${Number(value).toLocaleString()}` : "Not set";
}

export default function WeddingPlanCard({ plan, onDelete, onEdit }: Props) {
  return (
    <article className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Wedding Plan</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
            {plan.wedding_style || "Your wedding"} in {plan.location || "your chosen location"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="rounded-full border px-4 py-2 text-sm font-semibold">
            Edit Plan
          </button>
          <Link
            href="/dashboard/customer/ai-planner"
            className="rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
          >
            <Sparkles className="mr-1 inline h-4 w-4" /> Get AI Recommendations
          </Link>
          <button onClick={onDelete} className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            Delete Plan
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <p className="flex items-center gap-2 bg-event-paper p-3 text-sm">
          <CalendarDays className="h-4 w-4" /> {plan.wedding_date || "Date not set"}
        </p>
        <p className="flex items-center gap-2 bg-event-paper p-3 text-sm">
          <Users className="h-4 w-4" /> {plan.guest_count || "Guest count not set"}
        </p>
        <p className="flex items-center gap-2 bg-event-paper p-3 text-sm">
          <MapPin className="h-4 w-4" /> {plan.location || "Location not set"}
        </p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border border-[#111111]/10 p-4">
          <p className="text-xs font-semibold uppercase text-stone-500">Budget</p>
          <p className="mt-1 text-xl font-semibold text-[#111111]">{money(plan.budget)}</p>
        </div>
        <div className="border border-[#111111]/10 p-4">
          <p className="text-xs font-semibold uppercase text-stone-500">Preferred Services</p>
          <p className="mt-2 text-sm text-stone-700">
            {plan.preferred_services.length ? plan.preferred_services.join(", ") : "No services selected yet."}
          </p>
        </div>
      </div>
    </article>
  );
}
