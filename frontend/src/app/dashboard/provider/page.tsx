"use client";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  MessageCircle,
  PackagePlus,
  Star,
  Store,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardShell from "@/components/dashboard/DashboardShell";

const providerCards = [
  {
    title: "Business Profile Summary",
    description: "Review your public profile basics before adding richer details in account settings.",
    icon: Store,
    accent: "gold" as const,
  },
  {
    id: "packages",
    title: "My Service Packages",
    description: "Create wedding packages for couples to browse, compare, and request.",
    icon: PackagePlus,
    accent: "pink" as const,
  },
  {
    id: "booking-requests",
    title: "Booking Requests",
    description: "New customer requests and pending booking approvals will appear here.",
    icon: CalendarPlus,
    accent: "burgundy" as const,
  },
  {
    title: "Availability Calendar",
    description: "Manage open dates, blocked dates, and your event schedule.",
    icon: CalendarDays,
    accent: "gold" as const,
  },
  {
    title: "Customer Messages",
    description: "Reply to couples and keep every inquiry in one place.",
    icon: MessageCircle,
    accent: "pink" as const,
  },
  {
    id: "reviews",
    title: "Reviews & Ratings",
    description: "Customer reviews and rating trends will help build trust.",
    icon: Star,
    accent: "gold" as const,
  },
  {
    title: "Earnings Summary",
    description: "A simple overview for future booking earnings and completed services.",
    icon: BadgeDollarSign,
    accent: "burgundy" as const,
  },
  {
    title: "Provider Tools",
    description: "Quick access to the tools you will use most often as your business grows.",
    icon: BriefcaseBusiness,
    accent: "pink" as const,
  },
];

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {(session) => (
        <DashboardShell
          eyebrow="Service provider dashboard"
          title={`Welcome, ${session.user.full_name}`}
          description="Manage your wedding services, booking requests, customer messages, and business activity."
          actionLabel="Add New Package"
          actionHref="/dashboard/provider#packages"
        >
          {providerCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </DashboardShell>
      )}
    </ProtectedRoute>
  );
}
