"use client";

import {
  BookOpen,
  CalendarCheck,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
  ClipboardList,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardShell from "@/components/dashboard/DashboardShell";

const customerCards = [
  {
    title: "Wedding Plan Summary",
    description: "Track your event date, budget, guest list, and planning progress in one calm space.",
    icon: ClipboardList,
    accent: "gold" as const,
  },
  {
    title: "AI Recommendations",
    description: "Personalized service ideas will appear here once your wedding plan is created.",
    icon: Sparkles,
    accent: "pink" as const,
  },
  {
    title: "My Bookings",
    description: "Your confirmed and pending wedding service bookings will be listed here.",
    icon: CalendarCheck,
    accent: "burgundy" as const,
  },
  {
    title: "Favorite Services",
    description: "Save halls, photographers, caterers, and more so you can compare them later.",
    icon: Heart,
    accent: "pink" as const,
  },
  {
    title: "Messages",
    description: "Chat with service providers and keep planning conversations organized.",
    icon: MessageCircle,
    accent: "gold" as const,
  },
  {
    title: "Reviews",
    description: "Share feedback after your bookings and review providers you have worked with.",
    icon: Star,
    accent: "pink" as const,
  },
];

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {(session) => (
        <DashboardShell
          eyebrow="Customer dashboard"
          title={`Welcome, ${session.user.full_name}`}
          description="Plan your wedding, discover services, and keep every booking beautifully organized."
          actionLabel="Create Wedding Plan"
          actionHref="/wedding-plan"
        >
          {customerCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </DashboardShell>
      )}
    </ProtectedRoute>
  );
}
