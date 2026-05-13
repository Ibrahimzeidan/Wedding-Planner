import {
  BookOpen,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageCircle,
  PackagePlus,
  Sparkles,
  Settings,
  Star,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { getDashboardPath, type AuthUser } from "@/lib/auth";

export type DropdownItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function getDropdownItems(user: AuthUser): DropdownItem[] {
  const dashboard = { href: getDashboardPath(user.role), label: "Dashboard", icon: LayoutDashboard };

  if (user.role === "admin") {
    return [
      dashboard,
      { href: "/dashboard/admin/users", label: "Manage Users", icon: Settings },
      { href: "/dashboard/admin/categories", label: "Manage Categories", icon: BookOpen },
      { href: "/dashboard/admin/providers", label: "View Providers", icon: UserCircle },
      { href: "/dashboard/admin/wedding-plans", label: "Wedding Plans", icon: BookOpen },
      { href: "/dashboard/admin/favorites", label: "Favorites", icon: Heart },
      { href: "/account/settings", label: "Account Settings", icon: Settings },
    ];
  }

  if (user.role === "service_provider") {
    return [
      dashboard,
      { href: "/dashboard/provider/profile", label: "Provider Profile", icon: UserCircle },
      { href: "/account/settings", label: "Account Settings", icon: Settings },
      { href: "/dashboard/provider#packages", label: "My Packages", icon: PackagePlus },
      { href: "/dashboard/provider#booking-requests", label: "Booking Requests", icon: CalendarCheck },
      { href: "/messages", label: "Messages", icon: MessageCircle },
      { href: "/dashboard/provider/reviews", label: "Reviews", icon: Star },
    ];
  }

  return [
    dashboard,
    { href: "/dashboard/customer/wedding-plan", label: "Wedding Plan", icon: BookOpen },
    { href: "/dashboard/customer/ai-planner", label: "AI Planner", icon: Sparkles },
    { href: "/dashboard/customer/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ];
}
