import { CalendarCheck, Heart, MessageCircle, Star } from "lucide-react";

export const customerCards = [
  {
    title: "My Bookings",
    description: "Your confirmed and pending wedding service bookings will be listed here.",
    icon: CalendarCheck,
    accent: "burgundy" as const,
    href: "/dashboard/customer/bookings",
  },
  {
    title: "Favorite Services",
    description: "Save halls, photographers, caterers, and more so you can compare them later.",
    icon: Heart,
    accent: "pink" as const,
    href: "/dashboard/customer/favorites",
  },
  {
    title: "Messages",
    description: "Keep planning conversations with service providers organized.",
    icon: MessageCircle,
    accent: "gold" as const,
    href: "/dashboard/customer/messages",
  },
  {
    title: "Reviews",
    description: "Share feedback after bookings and review providers you have worked with.",
    icon: Star,
    accent: "pink" as const,
    href: "/dashboard/customer/reviews",
  },
];
