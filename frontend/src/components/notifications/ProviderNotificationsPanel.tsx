"use client";

import { useEffect, useState } from "react";
import NotificationCard from "@/components/notifications/NotificationCard";
import { acceptProviderBooking, rejectProviderBooking } from "@/lib/bookingsApi";
import { getProviderNotifications, markProviderNotificationRead } from "@/lib/notificationsApi";
import type { Notification, NotificationBookingAction } from "@/types/notification";

export default function ProviderNotificationsPanel() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");
  const [busyNotificationId, setBusyNotificationId] = useState<number | null>(null);

  async function load() {
    try {
      setItems(await getProviderNotifications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Notifications failed to load.");
    }
  }

  async function markRead(id: number) {
    await markProviderNotificationRead(id);
    await load();
  }

  async function respondToBooking(item: Notification, action: NotificationBookingAction) {
    if (!item.related_booking_id) return;
    setError("");
    setBusyNotificationId(item.id);
    try {
      if (action === "accept") {
        await acceptProviderBooking(item.related_booking_id);
      } else {
        await rejectProviderBooking(item.related_booking_id);
      }
      await markProviderNotificationRead(item.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking response failed.");
    } finally {
      setBusyNotificationId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="border border-[#111111]/10 bg-white p-5 shadow-soft sm:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#111111]">Booking Notifications</h2>
          <p className="text-sm text-stone-600">Booking updates and customer messages appear here.</p>
        </div>
        <span className="text-sm font-semibold">{items.filter((item) => !item.is_read).length} new</span>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <div className="grid gap-3 lg:grid-cols-2">
        {items.slice(0, 4).map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onRead={markRead}
            onBookingResponse={respondToBooking}
            isBusy={busyNotificationId === item.id}
          />
        ))}
        {!items.length && <p className="text-sm text-stone-600">No booking notifications yet.</p>}
      </div>
    </section>
  );
}
