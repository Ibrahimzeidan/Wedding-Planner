"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProviderRatingSummary from "@/components/reviews/ProviderRatingSummary";
import ReviewList from "@/components/reviews/ReviewList";
import { getMyProviderReviews } from "@/lib/reviewsApi";
import type { Review } from "@/types/review";

export default function ProviderReviewsPage() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {() => <ProviderReviewsBody />}
    </ProtectedRoute>
  );
}

function ProviderReviewsBody() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProviderReviews().then(setReviews).catch((err) => setError(err.message));
  }, []);

  const average = reviews.length
    ? reviews.reduce((total, item) => total + item.rating, 0) / reviews.length
    : 0;

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <Header rating={average} count={reviews.length} />
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <ReviewList reviews={reviews} context="provider" />
      </section>
    </main>
  );
}

function Header({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase text-stone-500">Provider dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Reviews & Ratings</h1>
      <p className="mt-2 text-sm text-stone-600">Read customer feedback from completed bookings.</p>
      <div className="mt-4">
        <ProviderRatingSummary rating={rating} count={count} />
      </div>
    </div>
  );
}
