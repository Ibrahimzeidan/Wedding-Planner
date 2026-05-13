"use client";

import { Bot, CalendarCheck, FolderKanban, Mail, Package, Star, Users, UserRoundCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import { getAdminStats } from "@/lib/adminApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminStats } from "@/types/admin";

const quickLinks = [
  { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { title: "Manage Providers", href: "/dashboard/admin/providers", icon: UserRoundCog },
  { title: "Manage Categories", href: "/dashboard/admin/categories", icon: FolderKanban },
  { title: "Manage Packages", href: "/dashboard/admin/packages", icon: Package },
  { title: "Manage Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
  { title: "Manage Reviews", href: "/dashboard/admin/reviews", icon: Star },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  const cards = [
    ["Total Users", stats?.total_users ?? "...", Users],
    ["Total Customers", stats?.total_customers ?? "...", Users],
    ["Total Service Providers", stats?.total_service_providers ?? "...", UserRoundCog],
    ["Total Categories", stats?.total_categories ?? "...", FolderKanban],
    ["Total Packages", stats?.total_packages ?? "...", Package],
    ["Total Wedding Packages", stats?.total_wedding_packages ?? "...", Package],
    ["Total Wedding Plans", stats?.total_wedding_plans ?? "...", CalendarCheck],
    ["Total Bookings", stats?.total_bookings ?? 0, CalendarCheck],
    ["Total Messages", stats?.total_messages ?? 0, Mail],
    ["Total Reviews", stats?.total_reviews ?? 0, Star],
  ] as const;
  const shownLinks = useMemo(
    () => quickLinks.filter((link) => matchesAdminSearch(link.title, search)),
    [search],
  );

  return (
    <AdminLayout title="Platform Overview" description="Control the main wedding planner data from one clean admin space.">
      {errorMessage && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([title, value, Icon]) => (
          <AdminCard key={title} title={title} value={value} icon={Icon} />
        ))}
      </div>
      <h2 className="mt-8 text-xl font-bold text-stone-950">Quick links</h2>
      <div className="mt-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox label="Search admin modules" value={search} onChange={setSearch}
          placeholder="Search users, providers, categories, packages, favorites..." />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shownLinks.map((link) => (
          <AdminCard
            key={link.title}
          title={link.title}
          href={link.href}
          icon={link.icon}
            description="Open this admin module."
          />
        ))}
      </div>
      <div className="mt-4">
        <AdminCard title="AI Recommendation History" href="/dashboard/admin/ai-recommendations"
          icon={Bot} description="Review and clear saved AI planner recommendations." />
      </div>
    </AdminLayout>
  );
}
