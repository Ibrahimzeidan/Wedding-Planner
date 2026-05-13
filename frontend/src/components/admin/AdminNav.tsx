"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/customers", label: "Customers" },
  { href: "/dashboard/admin/providers", label: "Providers" },
  { href: "/dashboard/admin/categories", label: "Categories" },
  { href: "/dashboard/admin/packages", label: "Packages" },
  { href: "/dashboard/admin/wedding-packages", label: "Wedding Packages" },
  { href: "/dashboard/admin/wedding-plans", label: "Wedding Plans" },
  { href: "/dashboard/admin/bookings", label: "Bookings" },
  { href: "/dashboard/admin/messages", label: "Messages" },
  { href: "/dashboard/admin/notifications", label: "Notifications" },
  { href: "/dashboard/admin/reviews", label: "Reviews" },
  { href: "/dashboard/admin/ai-recommendations", label: "AI Recommendations" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-white text-[#111111]"
                : "text-stone-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
