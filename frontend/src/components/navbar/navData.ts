import { House, Info, LogIn, Mail, Sparkles, UserPlus, type LucideIcon } from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/venues", label: "Venue", icon: Sparkles },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/packages", label: "Packages", icon: Sparkles },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact Us", icon: Mail },
];

export const guestLinks: NavLink[] = [
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
];
