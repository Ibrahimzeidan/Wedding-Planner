"use client";

import { useEffect, useState } from "react";
import ProviderRatingSummary from "@/components/reviews/ProviderRatingSummary";
import ReviewList from "@/components/reviews/ReviewList";
import { getProviderPublicReviews } from "@/lib/reviewsApi";
import type { Review } from "@/types/review";

type Props = {
  providerId: number;
};

export default function ProviderReviewSection({ providerId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProviderPublicReviews(providerId).then(setReviews).catch((err) => setError(err.message));
  }, [providerId]);

  const average = reviews.length
    ? reviews.reduce((total, item) => total + item.rating, 0) / reviews.length
    : 0;

  return (
    <section className="mt-8 border border-[#111111]/10 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Reviews</p>
          <h2 className="text-2xl font-semibold text-[#111111]">Couple feedback</h2>
        </div>
        <ProviderRatingSummary rating={average} count={reviews.length} />
      </div>
      {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mt-5">
        <ReviewList reviews={reviews} context="public" />
      </div>
    </section>
  );
}
