"use client";

import { useState } from "react";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { BookingStatus } from "@/types/booking";

type Props = {
  bookingId: number;
  bookingStatus: BookingStatus;
  providerName?: string | null;
  eventDate?: string | null;
};

export default function LeaveFeedbackButton({ bookingId, bookingStatus, providerName, eventDate }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const datePassed = eventDate ? new Date(eventDate) <= new Date() : false;

  if (bookingStatus !== "completed" || submitted || !datePassed) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
      >
        {open ? "Close Feedback" : "Leave Feedback"}
      </button>
      {open && (
        <ReviewForm
          bookingId={bookingId}
          providerName={providerName}
          onSuccess={() => {
            setSubmitted(true);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
