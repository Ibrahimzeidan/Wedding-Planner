"use client";

import Link from "next/link";
import { useState } from "react";
import BookingMessageButton from "@/components/bookings/BookingMessageButton";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import ProviderResponseModal from "@/components/bookings/ProviderResponseModal";
import type { Booking } from "@/types/booking";

type Action = "accept" | "reject" | null;
type Props = {
  booking: Booking;
  onAccept?: (id: number, note: string) => void;
  onReject?: (id: number, note: string) => void;
  onComplete?: (id: number) => void;
};

export default function ProviderBookingCard({ booking, onAccept, onReject, onComplete }: Props) {
  const [action, setAction] = useState<Action>(null);

  function submit(note: string) {
    if (action === "accept") onAccept?.(booking.id, note);
    if (action === "reject") onReject?.(booking.id, note);
    setAction(null);
  }

  return (
    <article className="rounded-md border border-[#111111]/10 bg-white p-5 shadow-soft">
      <Header booking={booking} />
      <Details booking={booking} />
      {booking.provider_response_note && <p className="mt-3 text-sm text-stone-700">Your note: {booking.provider_response_note}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {booking.booking_status === "pending" && (
          <>
            <button onClick={() => setAction("accept")} className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
              Accept
            </button>
            <button onClick={() => setAction("reject")} className="rounded-md border px-4 py-2 text-sm font-semibold">
              Reject
            </button>
          </>
        )}
        {booking.booking_status === "accepted" && (
          <button onClick={() => onComplete?.(booking.id)} className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
            Mark Completed
          </button>
        )}
        {["pending", "accepted"].includes(booking.booking_status) && (
          <BookingMessageButton bookingId={booking.id} conversationId={booking.conversation_id} role="provider" />
        )}
        {booking.booking_status === "completed" && (
          <Link href="/dashboard/provider/reviews" className="rounded-md border px-4 py-2 text-sm font-semibold">
            View Feedback
          </Link>
        )}
      </div>
      {action && (
        <ProviderResponseModal
          title={action === "accept" ? "Accept Booking" : "Reject Booking"}
          actionLabel={action === "accept" ? "Accept" : "Reject"}
          onClose={() => setAction(null)}
          onSubmit={submit}
        />
      )}
    </article>
  );
}

function Header({ booking }: { booking: Booking }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[#111111]">{booking.customer_name || "Customer"}</h2>
        <p className="text-sm text-stone-600">{booking.package_title || booking.wedding_package_title || "Custom booking"}</p>
      </div>
      <BookingStatusBadge status={booking.booking_status} />
    </div>
  );
}

function Details({ booking }: { booking: Booking }) {
  return (
    <div className="mt-4 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
      <p>Date: {booking.event_date?.slice(0, 10) || "-"}</p>
      <p>Guests: {booking.guest_count || "-"}</p>
      <p>Total: ${Number(booking.total_price || 0).toLocaleString()}</p>
      <p className="sm:col-span-2">Notes: {booking.notes || "-"}</p>
    </div>
  );
}
