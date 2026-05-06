"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLink from "@/components/navbar/BrandLink";
import NavLinkList from "@/components/navbar/NavLinkList";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import { guestLinks, navLinks } from "@/components/navbar/navData";
import { authChangedEvent, getAuthSession, type AuthUser } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const visibleLinks = user ? navLinks : [...navLinks, ...guestLinks];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function syncSession() {
      setUser(getAuthSession()?.user ?? null);
    }

    syncSession();
    window.addEventListener(authChangedEvent, syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener(authChangedEvent, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-3">
          <BrandLink />
          <div className="hidden items-center gap-1 lg:flex xl:gap-2">
            <NavLinkList links={visibleLinks} pathname={pathname} variant="desktop" />
            {user && <ProfileDropdown user={user} />}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {user && <ProfileDropdown user={user} />}
            <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((current) => !current)} />
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-3 grid gap-2 border border-white/10 bg-[#1c1c1c] p-2 shadow-soft sm:grid-cols-2 lg:hidden">
            <NavLinkList
              links={visibleLinks}
              pathname={pathname}
              variant="mobile"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        )}
      </nav>
    </header>
  );
}

function MenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111111]"
    >
      {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
