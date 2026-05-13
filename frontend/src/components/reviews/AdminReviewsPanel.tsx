"use client";

import { useEffect, useState } from "react";
import ReviewList from "@/components/reviews/ReviewList";
import { deleteAdminReview, getAdminReviews } from "@/lib/reviewsApi";
import type { Review } from "@/types/review";

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setReviews(await getAdminReviews());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reviews failed to load.");
    }
  }

  async function remove(id: number) {
    await deleteAdminReview(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <ReviewList reviews={reviews} context="admin" onDelete={remove} />
    </div>
  );
}
