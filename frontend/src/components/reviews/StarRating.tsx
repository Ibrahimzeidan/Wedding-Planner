import RatingStars from "@/components/reviews/RatingStars";

type Props = {
  rating: number;
  small?: boolean;
};

export default function StarRating({ rating, small = false }: Props) {
  return <RatingStars value={rating} small={small} />;
}
