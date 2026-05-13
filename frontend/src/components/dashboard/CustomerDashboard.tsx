"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { customerCards } from "@/components/dashboard/customerCards";
import WeddingPlanSummary from "@/components/wedding-plan/WeddingPlanSummary";
import { getFavorites } from "@/lib/favoritesApi";
import { getMyWeddingPlan } from "@/lib/weddingPlanApi";
import type { Favorite } from "@/types/favorite";
import type { WeddingPlan } from "@/types/weddingPlan";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRole="customer">
      {(session) => <CustomerDashboardBody name={session.user.full_name} />}
    </ProtectedRoute>
  );
}

function CustomerDashboardBody({ name }: { name: string }) {
  const [plan, setPlan] = useState<WeddingPlan | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    Promise.all([getMyWeddingPlan(), getFavorites()])
      .then(([planData, favoriteData]) => {
        setPlan(planData);
        setFavorites(favoriteData);
      })
      .catch(() => undefined);
  }, []);

  return (
    <DashboardShell
      eyebrow="Customer dashboard"
      title={`Welcome, ${name}`}
      description="Plan your wedding, discover services, and keep every booking beautifully organized."
      actionLabel={plan ? "Edit Wedding Plan" : "Create Wedding Plan"}
      actionHref="/dashboard/customer/wedding-plan"
    >
      <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
        <WeddingPlanSummary plan={plan} favoriteCount={favorites.length} />
      </div>
      <FavoritesPreview favorites={favorites} />
      {customerCards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </DashboardShell>
  );
}
function FavoritesPreview({ favorites }: { favorites: Favorite[] }) {
  const names = favorites.slice(0, 3).map((item) => item.provider_name || item.package_title);
  return (
    <article className="border border-[#111111]/10 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-[#111111]">Favorites Preview</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        {names.length ? names.join(", ") : "Your saved providers will appear here."}
      </p>
    </article>
  );
}
