"use client";

import { CalendarCheck, FolderKanban, MessageCircle, Star, Users, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";

const quickLinks = [
  { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { title: "Manage Categories", href: "/dashboard/admin/categories", icon: FolderKanban },
  { title: "View Providers", href: "/dashboard/admin/providers", icon: UserRoundCog },
  { title: "Bookings placeholder", href: "#", icon: CalendarCheck },
  { title: "Reviews placeholder", href: "#", icon: Star },
  { title: "Messages placeholder", href: "#", icon: MessageCircle },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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
    ["Total Bookings", stats?.total_bookings ?? 0, CalendarCheck],
    ["Total Reviews", stats?.total_reviews ?? 0, Star],
  ] as const;

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
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <AdminCard
            key={link.title}
            title={link.title}
            href={link.href}
            icon={link.icon}
            description="Open this admin module."
          />
        ))}
      </div>
    </AdminLayout>
  );
}
