import type { BookingFormData, BookingSeed } from "@/types/booking";
import { displayBookingDateTime } from "@/lib/bookingDate";

type Props = {
  seed: BookingSeed;
  form: BookingFormData;
};

export default function PaymentSummary({ seed, form }: Props) {
  return (
    <article className="border border-[#111111]/10 bg-event-paper p-4">
      <h3 className="font-semibold text-[#111111]">Payment Summary</h3>
      <dl className="mt-3 space-y-2 text-sm text-stone-700">
        <Row label="Provider" value={seed.providerName} />
        <Row label="Package" value={seed.packageTitle || "Custom provider booking"} />
        <Row label="Total price" value={`$${Number(seed.totalPrice || 0).toLocaleString()}`} />
        <Row label="Booking date and time" value={displayBookingDateTime(form)} />
        <Row label="Wedding venue" value={form.location || "Not selected"} />
      </dl>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right font-semibold text-[#111111]">{value}</dd>
    </div>
  );
}
