"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserCircle } from "lucide-react";
import ProfileDropdownPanel from "@/components/navbar/ProfileDropdownPanel";
import { getDropdownItems } from "@/components/navbar/profileDropdownItems";
import { clearAuthSession, type AuthUser } from "@/lib/auth";

type ProfileDropdownProps = {
  user: AuthUser;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const items = getDropdownItems(user);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearAuthSession();
    setIsOpen(false);
    router.push("/login");
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white text-[#111111] transition hover:bg-event-paper focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#111111]"
      >
        <UserCircle className="h-6 w-6" aria-hidden="true" />
      </button>
      {isOpen && (
        <ProfileDropdownPanel
          items={items}
          user={user}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
