import CustomerBookingCard from "@/components/bookings/CustomerBookingCard";
import ProviderBookingCard from "@/components/bookings/ProviderBookingCard";
import type { Booking } from "@/types/booking";

type Props = {
  booking: Booking;
  mode: "customer" | "provider";
  onCancel?: (id: number) => void;
  onAccept?: (id: number, note: string) => void;
  onReject?: (id: number, note: string) => void;
  onComplete?: (id: number) => void;
};

export default function BookingCard({ booking, mode, onCancel, onAccept, onReject, onComplete }: Props) {
  if (mode === "customer") {
    return <CustomerBookingCard booking={booking} onCancel={onCancel} />;
  }
  return (
    <ProviderBookingCard
      booking={booking}
      onAccept={onAccept}
      onReject={onReject}
      onComplete={onComplete}
    />
  );
}
