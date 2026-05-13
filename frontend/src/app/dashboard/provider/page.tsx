"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { providerCards } from "@/components/dashboard/providerCards";
import ProviderNotificationsPanel from "@/components/notifications/ProviderNotificationsPanel";

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {(session) => (
        <DashboardShell
          eyebrow="Service provider dashboard"
          title={`Welcome, ${session.user.full_name}`}
          description="Manage your wedding services, booking requests, customer messages, and business activity."
          actionLabel="Add New Package"
          actionHref="/dashboard/provider/packages"
        >
          <ProviderNotificationsPanel />
          {providerCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </DashboardShell>
      )}
    </ProtectedRoute>
  );
}
