import Link from "next/link";
import { LogOut } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { getRoleLabel } from "@/lib/auth";
import type { DropdownItem } from "@/components/navbar/profileDropdownItems";

type ProfileDropdownPanelProps = {
  items: DropdownItem[];
  user: AuthUser;
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfileDropdownPanel({
  items,
  user,
  onClose,
  onLogout,
}: ProfileDropdownPanelProps) {
  return (
    <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="border-b border-[#111111]/10 bg-event-paper px-4 py-3">
        <p className="truncate text-sm font-semibold text-stone-950">{user.full_name}</p>
        <p className="mt-0.5 truncate text-xs text-stone-500">{getRoleLabel(user.role)}</p>
      </div>
      <div className="grid gap-1 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-event-paper hover:text-[#111111]"
            >
              <Icon size={17} strokeWidth={1.8} className="text-[#111111]" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
