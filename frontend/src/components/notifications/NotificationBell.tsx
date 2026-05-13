"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/notificationsApi";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getNotifications()
      .then((items) => setCount(items.filter((item) => !item.is_read).length))
      .catch(() => setCount(0));
  }, []);

  return (
    <Link
      href="/notifications"
      aria-label="Open notifications"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-sky-400 px-1.5 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
