"use client";

import { useState } from "react";
import AlternativeSuggestionCard from "@/components/bookings/AlternativeSuggestionCard";
import BookingMessageButton from "@/components/bookings/BookingMessageButton";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import LeaveFeedbackButton from "@/components/bookings/LeaveFeedbackButton";
import { findReplacementProvider } from "@/lib/aiApi";
import type { AIReplacementData } from "@/types/ai";
import type { Booking } from "@/types/booking";

type Props = {
  booking: Booking;
  onCancel?: (id: number) => void;
};

export default function CustomerBookingCard({ booking, onCancel }: Props) {
  const [details, setDetails] = useState(false);
  const [alternative, setAlternative] = useState<AIReplacementData | null>(null);
  const [message, setMessage] = useState("");

  async function findAlternative() {
    setMessage("");
    const result = await findReplacementProvider(booking.id);
    setAlternative(result.data || null);
    setMessage(result.message);
  }

  return (
    <article className="rounded-md border border-[#111111]/10 bg-white p-5 shadow-soft">
      <Header booking={booking} />
      <Details booking={booking} open={details} />
      {booking.provider_response_note && <p className="mt-3 text-sm text-stone-700">Provider note: {booking.provider_response_note}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {booking.booking_status === "pending" && (
          <button onClick={() => onCancel?.(booking.id)} className="rounded-md border px-4 py-2 text-sm font-semibold">
            Cancel Booking
          </button>
        )}
        {["pending", "accepted", "rejected"].includes(booking.booking_status) && (
          <BookingMessageButton bookingId={booking.id} conversationId={booking.conversation_id} role="customer" />
        )}
        {booking.booking_status === "accepted" && (
          <button onClick={() => setDetails((value) => !value)} className="rounded-md border px-4 py-2 text-sm font-semibold">
            View Details
          </button>
        )}
        {booking.booking_status === "rejected" && (
          <button onClick={findAlternative} className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
            Find Alternative
          </button>
        )}
      </div>
      {message && <p className="mt-3 text-sm text-stone-600">{message}</p>}
      {alternative && <AlternativeSuggestionCard item={alternative} />}
      <LeaveFeedbackButton
        bookingId={booking.id}
        bookingStatus={booking.booking_status}
        providerName={booking.provider_name}
        eventDate={booking.event_date}
      />
    </article>
  );
}

function Header({ booking }: { booking: Booking }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[#111111]">{booking.provider_name || "Provider"}</h2>
        <p className="text-sm text-stone-600">{booking.package_title || booking.wedding_package_title || "Custom booking"}</p>
      </div>
      <BookingStatusBadge status={booking.booking_status} />
    </div>
  );
}

function Details({ booking, open }: { booking: Booking; open: boolean }) {
  if (!open && booking.booking_status === "accepted") return null;
  return (
    <div className="mt-4 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
      <p>Date: {booking.event_date?.slice(0, 10) || "-"}</p>
      <p>Guests: {booking.guest_count || "-"}</p>
      <p>Payment: {booking.payment_method || "-"}</p>
      <p>Total: ${Number(booking.total_price || 0).toLocaleString()}</p>
      <p className="sm:col-span-2">Location: {booking.location || "-"}</p>
    </div>
  );
}
