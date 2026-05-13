"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CalendarCheck, Heart, LayoutDashboard, LogOut, Mail, Settings, UserCircle } from "lucide-react";
import { clearAuthSession, type UserRole } from "@/lib/auth";

type Props = {
  role: UserRole;
};

export default function ProfileSidebar({ role }: Props) {
  const router = useRouter();
  const provider = role === "service_provider";
  const links = provider
    ? [["Dashboard", "/dashboard/provider", LayoutDashboard], ["My Profile", "/dashboard/provider/profile", UserCircle],
       ["My Packages", "/dashboard/provider/packages", CalendarCheck], ["Bookings", "/bookings", CalendarCheck],
       ["Availability", "/account/settings", Bell], ["Reviews", "/dashboard/provider/profile", Heart],
       ["Earnings", "/dashboard/provider", Heart], ["Messages", "/messages", Mail],
       ["Settings", "/account/settings", Settings]]
    : [["Dashboard", "/dashboard/customer", LayoutDashboard], ["My Profile", "/dashboard/customer/profile", UserCircle],
       ["My Wedding Plan", "/wedding-plan", CalendarCheck], ["My Bookings", "/bookings", CalendarCheck],
       ["My Favorites", "/favorites", Heart], ["Messages", "/messages", Mail],
       ["Notifications", "/account/settings", Bell], ["Settings", "/account/settings", Settings]];

  function logout() {
    clearAuthSession();
    router.push("/login");
  }

  return (
    <aside className="rounded-2xl bg-[#111111] p-5 text-white lg:min-h-[760px]">
      <p className="text-xl font-semibold italic">Happily Ever Afters</p>
      <p className="text-sm text-white/70">wedding events</p>
      <nav className="mt-10 grid gap-2">
        {links.map(([label, href, Icon]) => (
          <Link key={label as string} href={href as string}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10">
            <Icon className="h-4 w-4" />{label as string}
          </Link>
        ))}
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/85">
          <LogOut className="h-4 w-4" />Logout
        </button>
      </nav>
      <p className="mt-24 text-center text-sm italic text-white/75">The best love story is the one you write together.</p>
    </aside>
  );
}
