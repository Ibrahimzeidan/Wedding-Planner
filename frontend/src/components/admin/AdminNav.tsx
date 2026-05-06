"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/categories", label: "Categories" },
  { href: "/dashboard/admin/providers", label: "Providers" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[#111111] text-white shadow-soft"
                : "border border-[#111111]/15 bg-white text-stone-700 hover:border-[#111111]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
