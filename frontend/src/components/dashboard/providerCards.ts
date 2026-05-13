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

export const providerCards = [
  { title: "Business Profile Summary", description: "Review your public profile basics.", icon: Store, accent: "gold" as const },
  { id: "packages", title: "My Service Packages", description: "Create packages couples can request.", icon: PackagePlus, accent: "pink" as const, href: "/dashboard/provider/packages" },
  { id: "booking-requests", title: "Booking Requests", description: "Review new customer requests.", icon: CalendarPlus, accent: "burgundy" as const, href: "/dashboard/provider/bookings" },
  { title: "Availability Calendar", description: "Manage open and blocked dates.", icon: CalendarDays, accent: "gold" as const },
  { title: "Customer Messages", description: "Reply to couples in one place.", icon: MessageCircle, accent: "pink" as const, href: "/dashboard/provider/messages" },
  { id: "reviews", title: "Reviews & Ratings", description: "Track customer feedback.", icon: Star, accent: "gold" as const, href: "/dashboard/provider/reviews" },
  { title: "Earnings Summary", description: "Review future booking earnings.", icon: BadgeDollarSign, accent: "burgundy" as const },
  { title: "Provider Tools", description: "Open your core business tools.", icon: BriefcaseBusiness, accent: "pink" as const },
];
