import ReviewForm from "@/components/reviews/ReviewForm";

type Props = {
  bookingId: number;
  providerName?: string | null;
};

export default function BookingReviewAction({ bookingId, providerName }: Props) {
  return <ReviewForm bookingId={bookingId} providerName={providerName} />;
}
