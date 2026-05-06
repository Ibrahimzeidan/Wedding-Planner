"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { House, Info, LogIn, Mail, User, UserPlus, type LucideIcon } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact Us", icon: Mail },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8b45f]/40 bg-[#42162f]/95 shadow-[0_8px_24px_rgba(66,22,47,0.14)] backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fff8e7] ring-1 ring-[#d8b45f]">
            <Image
              src="/images/logo.jpeg"
              alt="Smart Wedding Planner logo"
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
              priority
            />
          </span>
          <div>
            <p className="text-lg font-semibold text-[#fff8e7]">Smart Wedding Planner</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#f5c7d3]">Elegant planning</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#fff8e7] text-[#42162f] ring-1 ring-[#d8b45f]/70"
                    : "text-[#fff8e7] hover:bg-[#fff8e7]/12 hover:text-[#f5c7d3]"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
