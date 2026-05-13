import ReviewCard from "@/components/reviews/ReviewCard";
import type { Review } from "@/types/review";

type Props = {
  reviews: Review[];
  context?: "provider" | "admin" | "public" | "customer";
  onDelete?: (id: number) => void;
};

export default function ReviewList({ reviews, context = "public", onDelete }: Props) {
  if (!reviews.length) {
    return <p className="bg-white p-5 text-sm text-stone-600 shadow-soft">No reviews yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} context={context} onDelete={onDelete} />
      ))}
    </div>
  );
}
