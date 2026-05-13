"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ReviewList from "@/components/reviews/ReviewList";
import { getMyReviews } from "@/lib/reviewsApi";
import type { Review } from "@/types/review";

export default function CustomerReviewsPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => <CustomerReviewsBody />}
    </ProtectedRoute>
  );
}

function CustomerReviewsBody() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyReviews().then(setReviews).catch((err) => setError(err.message));
  }, []);

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">My Reviews</h1>
          <p className="mt-2 text-sm text-stone-600">Feedback you shared after completed bookings.</p>
        </div>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <ReviewList reviews={reviews} context="customer" />
      </section>
    </main>
  );
}
