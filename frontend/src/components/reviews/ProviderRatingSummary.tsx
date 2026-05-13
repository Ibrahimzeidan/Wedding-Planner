import RatingStars from "@/components/reviews/RatingStars";

type Props = {
  rating: number;
  count: number;
  compact?: boolean;
};

export default function ProviderRatingSummary({ rating, count, compact = false }: Props) {
  const rounded = Math.round(rating || 0);

  return (
    <div className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-stone-700`}>
      <RatingStars value={rounded} small={compact} />
      <span className="font-semibold text-[#111111]">{count ? rating.toFixed(1) : "No rating"}</span>
      <span>({count} review{count === 1 ? "" : "s"})</span>
    </div>
  );
}
