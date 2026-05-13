"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProviderBookingGroup from "@/components/bookings/ProviderBookingGroup";
import { acceptProviderBooking, completeProviderBooking } from "@/lib/bookingsApi";
import { getProviderBookings, rejectProviderBooking } from "@/lib/bookingsApi";
import type { Booking } from "@/types/booking";

export default function ProviderBookingsPage() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {() => <ProviderBookingsBody />}
    </ProtectedRoute>
  );
}

function ProviderBookingsBody() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setBookings(await getProviderBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bookings failed to load.");
    }
  }

  async function accept(id: number, note: string) {
    await acceptProviderBooking(id, note);
    await load();
  }

  async function reject(id: number, note: string) {
    await rejectProviderBooking(id, note);
    await load();
  }

  async function complete(id: number) {
    await completeProviderBooking(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const requests = bookings.filter((item) => item.booking_status === "pending");
  const completed = bookings.filter((item) => item.booking_status === "completed");
  const active = bookings.filter((item) => !["pending", "completed"].includes(item.booking_status));

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <Header />
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <ProviderBookingGroup title="Booking Requests" bookings={requests} onAccept={accept} onReject={reject} onComplete={complete} />
        <ProviderBookingGroup title="Active Bookings" bookings={active} onAccept={accept} onReject={reject} onComplete={complete} />
        <ProviderBookingGroup title="Completed Bookings" bookings={completed} onAccept={accept} onReject={reject} onComplete={complete} />
      </section>
    </main>
  );
}

function Header() {
  return (
    <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase text-stone-500">Provider dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Booking Requests</h1>
      <p className="mt-2 text-sm text-stone-600">Accept, reject, and complete customer bookings.</p>
    </div>
  );
}
