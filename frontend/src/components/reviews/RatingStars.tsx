"use client";

import { Star } from "lucide-react";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  small?: boolean;
};

export default function RatingStars({ value, onChange, small = false }: Props) {
  const size = small ? "h-4 w-4" : "h-6 w-6";
  const label = `${value} out of 5 stars`;

  return (
    <div className="flex items-center gap-1" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const icon = (
          <Star className={`${size} ${filled ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
        );

        if (!onChange) return <span key={star}>{icon}</span>;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-full p-1 transition hover:bg-amber-50"
            aria-label={`Choose ${star} star${star > 1 ? "s" : ""}`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
