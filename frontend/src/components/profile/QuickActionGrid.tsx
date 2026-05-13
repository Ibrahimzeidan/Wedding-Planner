import Link from "next/link";
import { CalendarCheck, Heart, PackagePlus, Settings, Sparkles } from "lucide-react";
import type { UserRole } from "@/lib/auth";

export default function QuickActionGrid({ role }: { role: UserRole }) {
  const provider = role === "service_provider";
  const actions = provider
    ? [["Add New Package", "Add your service package", PackagePlus, "/dashboard/provider/packages"],
       ["Manage Availability", "Update your calendar", CalendarCheck, "/account/settings"],
       ["View Bookings", "Manage booking requests", CalendarCheck, "/bookings"],
       ["Business Settings", "Update business info", Settings, "/account/settings"]]
    : [["Create Wedding Plan", "Get AI recommendations", Sparkles, "/wedding-plan"],
       ["View My Bookings", "Check your bookings", CalendarCheck, "/bookings"],
       ["View Favorites", "Your saved items", Heart, "/favorites"],
       ["My AI Wedding Plan", "View your smart plan", Sparkles, "/wedding-plan"]];
  return (
    <section className="mt-6">
      <h2 className="font-bold">Quick Actions</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map(([title, body, Icon, href]) => (
          <Link key={title as string} href={href as string} className="rounded-xl bg-white p-5 shadow-soft hover:-translate-y-0.5">
            <Icon className="h-8 w-8 rounded-lg bg-rose-100 p-2 text-rose-600" />
            <h3 className="mt-3 text-sm font-bold">{title as string}</h3>
            <p className="text-xs text-stone-500">{body as string}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
