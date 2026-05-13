import { requestJson, withAuth } from "@/lib/packageRequest";
import type { Review, ReviewPayload } from "@/types/review";

export function createReview(payload: ReviewPayload) {
  return requestJson<Review>("/reviews", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
}

export function getProviderPublicReviews(providerId: number | string) {
  return requestJson<Review[]>(`/providers/${providerId}/reviews`);
}

export function getMyReviews() {
  return requestJson<Review[]>("/reviews/me", withAuth());
}

export function getMyProviderReviews() {
  return requestJson<Review[]>("/provider/reviews", withAuth());
}

export function getAdminReviews() {
  return requestJson<Review[]>("/admin/reviews", withAuth());
}

export function deleteAdminReview(id: number) {
  return requestJson<{ message: string }>(`/admin/reviews/${id}`, withAuth({ method: "DELETE" }));
}
