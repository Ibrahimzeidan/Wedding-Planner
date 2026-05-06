import Link from "next/link";
import type { NavLink } from "@/components/navbar/navData";

type NavLinkListProps = {
  links: NavLink[];
  pathname: string;
  onClick?: () => void;
  variant: "desktop" | "mobile";
};

const baseClasses = "font-medium transition";

export default function NavLinkList({ links, pathname, onClick, variant }: NavLinkListProps) {
  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        const active = "bg-white text-[#111111]";
        const idle = "text-white/80 hover:bg-white/10 hover:text-white";
        const layout =
          variant === "desktop"
            ? "flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            : "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm";

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`${baseClasses} ${layout} ${isActive ? active : idle}`}
          >
            <Icon
              size={variant === "desktop" ? 16 : 17}
              strokeWidth={1.8}
              className="shrink-0"
              aria-hidden="true"
            />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}
