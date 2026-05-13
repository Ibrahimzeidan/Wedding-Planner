"use client";

import { Bell, Briefcase, CalendarDays, KeyRound, UserCircle } from "lucide-react";
import type { UserRole } from "@/lib/auth";

type SettingsSidebarProps = {
  active: string;
  role: UserRole;
  onChange: (value: string) => void;
};

export default function SettingsSidebar({ active, role, onChange }: SettingsSidebarProps) {
  const provider = role === "service_provider";
  const items = provider
    ? [["business", "Business Information", Briefcase], ["packages", "Packages & Services", Briefcase],
       ["availability", "Availability", CalendarDays], ["password", "Change Password", KeyRound],
       ["notifications", "Notification Settings", Bell]]
    : [["profile", "Profile Information", UserCircle], ["wedding", "Wedding Preferences", CalendarDays],
       ["password", "Change Password", KeyRound], ["notifications", "Notification Settings", Bell]];
  return (
    <aside className="rounded-2xl bg-white p-3 shadow-soft lg:min-h-[560px]">
      {items.map(([key, label, Icon]) => (
        <button key={key as string} type="button" onClick={() => onChange(key as string)}
          className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
            active === key ? "bg-rose-100 text-rose-700" : "text-stone-700 hover:bg-stone-100"
          }`}>
          <Icon className="h-4 w-4" />
          {label as string}
        </button>
      ))}
    </aside>
  );
}
