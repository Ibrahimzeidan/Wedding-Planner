"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BookingTable from "@/components/bookings/BookingTable";
import { deleteAdminBooking, getAdminBookings, updateAdminBooking } from "@/lib/bookingsApi";
import type { Booking, BookingStatus } from "@/types/booking";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  async function load() {
    setBookings(await getAdminBookings());
  }

  async function update(id: number, booking_status: BookingStatus) {
    await updateAdminBooking(id, { booking_status });
    await load();
  }

  async function remove(id: number) {
    await deleteAdminBooking(id);
    await load();
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  return (
    <AdminLayout title="Bookings" description="View, edit, and delete platform bookings.">
      <BookingTable bookings={bookings} onDelete={remove} onStatus={update} />
    </AdminLayout>
  );
}
