"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import RatingStars from "@/components/reviews/RatingStars";
import { createReview } from "@/lib/reviewsApi";

type Props = {
  bookingId: number;
  providerName?: string | null;
  onSuccess?: () => void;
};

export default function ReviewForm({ bookingId, providerName, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await createReview({ booking_id: bookingId, rating, comment });
      setComment("");
      setMessage("Feedback submitted. Thank you.");
      onSuccess?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Feedback could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submitReview} className="mt-4 space-y-3 border-t border-[#111111]/10 pt-4">
      <div>
        <p className="text-sm font-semibold text-[#111111]">Review {providerName || "provider"}</p>
        <RatingStars value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share what stood out about the service."
        className="min-h-24 w-full rounded-md border border-[#111111]/15 px-3 py-2 text-sm"
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Submitting..." : "Submit Feedback"}
      </button>
      {message && <p className="text-sm text-stone-600">{message}</p>}
    </form>
  );
}
