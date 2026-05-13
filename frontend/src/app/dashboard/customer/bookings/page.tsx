"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingCard from "@/components/bookings/BookingCard";
import { cancelBooking, getMyBookings } from "@/lib/bookingsApi";
import type { Booking } from "@/types/booking";

export default function CustomerBookingsPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => <CustomerBookingsBody />}
    </ProtectedRoute>
  );
}

function CustomerBookingsBody() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setBookings(await getMyBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bookings failed to load.");
    }
  }

  async function cancel(id: number) {
    await cancelBooking(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const upcoming = bookings.filter((item) => !["completed", "cancelled"].includes(item.booking_status));
  const history = bookings.filter((item) => ["completed", "cancelled"].includes(item.booking_status));

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <Header title="My Bookings" description="Track upcoming bookings, payment status, and history." />
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <BookingGroup title="Upcoming Bookings" bookings={upcoming} onCancel={cancel} />
        <BookingGroup title="Booking History" bookings={history} onCancel={cancel} />
      </section>
    </main>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#111111]">{title}</h1>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
    </div>
  );
}

function BookingGroup({ title, bookings, onCancel }: { title: string; bookings: Booking[]; onCancel: (id: number) => void }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-[#111111]">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {bookings.length ? bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} mode="customer" onCancel={onCancel} />
        )) : <p className="bg-white p-5 text-sm text-stone-600 shadow-soft">No bookings here yet.</p>}
      </div>
    </section>
  );
}
