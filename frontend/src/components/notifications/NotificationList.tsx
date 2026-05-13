"use client";

import NotificationCard from "@/components/notifications/NotificationCard";
import type { Notification, NotificationBookingAction } from "@/types/notification";

type Props = {
  items: Notification[];
  onRead: (id: number) => void;
  onReadAll: () => void;
  onBookingResponse?: (item: Notification, action: NotificationBookingAction) => void;
  busyNotificationId?: number | null;
};

export default function NotificationList({ items, onRead, onReadAll, onBookingResponse, busyNotificationId }: Props) {
  const unread = items.filter((item) => !item.is_read).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-stone-700">{unread} unread notification{unread === 1 ? "" : "s"}</p>
        <button
          type="button"
          onClick={onReadAll}
          disabled={!unread}
          className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Mark All Read
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onRead={onRead}
            onBookingResponse={onBookingResponse}
            isBusy={busyNotificationId === item.id}
          />
        ))}
        {!items.length && <p className="bg-white p-5 text-sm text-stone-600 shadow-soft">No notifications yet.</p>}
      </div>
    </section>
  );
}
