"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingFlowContent from "@/components/bookings/BookingFlowContent";
import { createBooking } from "@/lib/bookingsApi";
import { validateBookingForm } from "@/lib/bookingDate";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import { ApiError } from "@/lib/packageRequest";
import type { BookingSeed, PaymentMethod } from "@/types/booking";
import { bookingPayload, emptyBookingForm, loginReturnPath } from "./bookingFlowUtils";

type Props = { seed: BookingSeed; label?: string; className?: string };
export default function BookingFlow({ seed, label = "Book Now", className }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [form, setForm] = useState(emptyBookingForm);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function reset() {
    setIsOpen(false);
    setStep("form");
    setError("");
    setIsLoading(false);
  }

  function open() {
    if (!getAuthSession()) {
      router.push(loginReturnPath());
      return;
    }
    setIsOpen(true);
  }

  function continueToPayment() {
    const message = validateBookingForm(form);
    setError(message);
    if (!message) setStep("payment");
  }

  async function confirm() {
    setError("");
    setIsLoading(true);
    try {
      await createBooking(bookingPayload(seed, form, method));
      setStep("success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthSession();
        router.push(loginReturnPath());
        return;
      }
      if (err instanceof ApiError && err.status === 409) setStep("form");
      setError(err instanceof Error ? err.message : "Booking failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={open} className={className}>
        {label}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 px-4 py-8">
          <div className="mx-auto max-h-[90vh] max-w-2xl overflow-y-auto bg-white p-6 shadow-soft">
            <BookingFlowContent
              seed={seed}
              step={step}
              form={form}
              method={method}
              error={error}
              isLoading={isLoading}
              setForm={setForm}
              setMethod={setMethod}
              setStep={setStep}
              onCancel={reset}
              onContinue={continueToPayment}
              onConfirm={confirm}
            />
          </div>
        </div>
      )}
    </>
  );
}
