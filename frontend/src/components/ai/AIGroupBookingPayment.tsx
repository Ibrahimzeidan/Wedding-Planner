"use client";

import CreditCardForm from "@/components/payment/CreditCardForm";
import PaymentMethods from "@/components/payment/PaymentMethods";
import PaypalPlaceholder from "@/components/payment/PaypalPlaceholder";
import { displayBookingDateTime } from "@/lib/bookingDate";
import type { AIRecommendationSummary } from "@/types/ai";
import type { BookingFormData, PaymentMethod } from "@/types/booking";

type Props = {
  summary: AIRecommendationSummary;
  form: BookingFormData;
  method: PaymentMethod;
  isLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onMethodChange: (method: PaymentMethod) => void;
};

function money(value: number) {
  return `$${Number(value).toLocaleString()}`;
}

export default function AIGroupBookingPayment(props: Props) {
  const { summary, form, method, isLoading, onBack, onConfirm, onMethodChange } = props;

  return (
    <div className="space-y-4">
      <article className="border border-[#111111]/10 bg-event-paper p-4">
        <h3 className="font-semibold text-[#111111]">Package Payment Summary</h3>
        <dl className="mt-3 space-y-2 text-sm text-stone-700">
          <Row label="Services" value={`${summary.items.length} provider bookings`} />
          <Row label="Total price" value={money(summary.total_estimated_cost)} />
          <Row label="Booking date and time" value={displayBookingDateTime(form)} />
          <Row label="Wedding venue" value={form.location || "Not selected"} />
        </dl>
      </article>
      <PaymentMethods value={method} onChange={onMethodChange} />
      {method === "credit_card" && <CreditCardForm />}
      {method === "paypal" && <PaypalPlaceholder />}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Booking..." : "Book Full Package"}
        </button>
        <button type="button" onClick={onBack} className="border px-5 py-3 text-sm font-semibold">
          Back
        </button>
      </div>
    </div>
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
