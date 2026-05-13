import RatingStars from "@/components/reviews/RatingStars";
import type { Review } from "@/types/review";

type Props = {
  review: Review;
  context?: "provider" | "admin" | "public" | "customer";
  onDelete?: (id: number) => void;
};

export default function ReviewCard({ review, context = "public", onDelete }: Props) {
  const date = new Date(review.created_at).toLocaleDateString();
  const title = context === "customer" ? review.provider_name : review.customer_name;
  const subtitle = context === "admin" ? review.provider_name : null;

  return (
    <article className="rounded-md border border-[#111111]/10 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111111]">{title || "Wedding planner user"}</p>
          {subtitle && <p className="text-xs text-stone-500">For {subtitle}</p>}
          <p className="text-xs uppercase text-stone-500">{date}</p>
        </div>
        <RatingStars value={review.rating} small />
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-700">{review.comment || "No comment added."}</p>
      {context === "admin" && (
        <button
          type="button"
          onClick={() => onDelete?.(review.id)}
          className="mt-4 rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
        >
          Delete review
        </button>
      )}
    </article>
  );
}
