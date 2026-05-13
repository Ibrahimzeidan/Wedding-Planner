"use client";

import CreditCardForm from "@/components/payment/CreditCardForm";
import PaymentMethods from "@/components/payment/PaymentMethods";
import PaypalPlaceholder from "@/components/payment/PaypalPlaceholder";
import PaymentSummary from "@/components/bookings/PaymentSummary";
import type { BookingFormData, BookingSeed, PaymentMethod } from "@/types/booking";

type Props = {
  seed: BookingSeed;
  form: BookingFormData;
  method: PaymentMethod;
  isLoading: boolean;
  onMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export default function PaymentModal({
  seed,
  form,
  method,
  isLoading,
  onMethodChange,
  onBack,
  onConfirm,
}: Props) {
  return (
    <div className="space-y-4">
      <PaymentSummary seed={seed} form={form} />
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
          {isLoading ? "Confirming..." : "Confirm Booking"}
        </button>
        <button type="button" onClick={onBack} className="border px-5 py-3 text-sm font-semibold">
          Back
        </button>
      </div>
    </div>
  );
}
