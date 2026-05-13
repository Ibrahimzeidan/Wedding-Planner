import BookingCard from "@/components/bookings/BookingCard";
import type { Booking } from "@/types/booking";

type Props = {
  title: string;
  bookings: Booking[];
  onAccept: (id: number, note: string) => void;
  onReject: (id: number, note: string) => void;
  onComplete: (id: number) => void;
};

export default function ProviderBookingGroup({ title, bookings, onAccept, onReject, onComplete }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-[#111111]">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {bookings.length ? bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            mode="provider"
            onAccept={onAccept}
            onReject={onReject}
            onComplete={onComplete}
          />
        )) : <p className="bg-white p-5 text-sm text-stone-600 shadow-soft">No bookings here yet.</p>}
      </div>
    </section>
  );
}
