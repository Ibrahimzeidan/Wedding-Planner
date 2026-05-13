"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationList from "@/components/notifications/NotificationList";
import { acceptProviderBooking, rejectProviderBooking } from "@/lib/bookingsApi";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/notificationsApi";
import type { Notification, NotificationBookingAction } from "@/types/notification";

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      {() => <NotificationsBody />}
    </ProtectedRoute>
  );
}

function NotificationsBody() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");
  const [busyNotificationId, setBusyNotificationId] = useState<number | null>(null);

  async function load() {
    try {
      setItems(await getNotifications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Notifications failed to load.");
    }
  }

  async function read(id: number) {
    await markNotificationRead(id);
    await load();
  }

  async function readAll() {
    await markAllNotificationsRead();
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
      await markNotificationRead(item.id);
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
    <main className="min-h-screen bg-[#efefef] px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase text-stone-500">Planner updates</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Notifications</h1>
        </div>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <NotificationList
          items={items}
          onRead={read}
          onReadAll={readAll}
          onBookingResponse={respondToBooking}
          busyNotificationId={busyNotificationId}
        />
      </section>
    </main>
  );
}
