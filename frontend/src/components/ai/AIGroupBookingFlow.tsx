"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AIGroupBookingForm from "@/components/ai/AIGroupBookingForm";
import AIGroupBookingPayment from "@/components/ai/AIGroupBookingPayment";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import { createBulkBookings } from "@/lib/bookingsApi";
import { validateBookingForm } from "@/lib/bookingDate";
import { ApiError } from "@/lib/packageRequest";
import { bookingPayload, emptyBookingForm, loginReturnPath } from "@/components/bookings/bookingFlowUtils";
import type { AIRecommendationSummary } from "@/types/ai";
import type { PaymentMethod } from "@/types/booking";

export default function AIGroupBookingFlow({ summary }: { summary: AIRecommendationSummary }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [form, setForm] = useState(emptyBookingForm);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function open() {
    if (!getAuthSession()) return router.push(loginReturnPath());
    setIsOpen(true);
  }

  function reset() {
    setIsOpen(false);
    setStep("form");
    setError("");
    setIsLoading(false);
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
      await createBulkBookings(summary.items.map((item) => bookingPayload(seed(item), form, method)));
      setStep("success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthSession();
        return router.push(loginReturnPath());
      }
      if (err instanceof ApiError && err.status === 409) setStep("form");
      setError(err instanceof Error ? err.message : "Package booking failed.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <button onClick={open} className="w-full bg-[#111111] px-4 py-3 text-sm font-semibold text-white">
        Book Full Package
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 px-4 py-8">
          <div className="mx-auto max-h-[90vh] max-w-2xl overflow-y-auto bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-2xl font-semibold text-[#111111]">Book AI Package</h2>
            {error && <p className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
            {step === "success" ? <Success onClose={reset} /> : step === "form" ? (
              <AIGroupBookingForm form={form} onChange={setForm} onCancel={reset} onContinue={continueToPayment} />
            ) : (
              <AIGroupBookingPayment summary={summary} form={form} method={method} isLoading={isLoading}
                onBack={() => setStep("form")} onConfirm={confirm} onMethodChange={setMethod} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function seed(item: AIRecommendationSummary["items"][number]) {
  return { providerId: item.provider_id, providerName: item.provider, packageId: item.package_id,
    packageTitle: item.package, totalPrice: item.price };
}
function Success({ onClose }: { onClose: () => void }) {
  return <div className="space-y-4 text-center"><p className="text-sm text-stone-600">
    Booking requests were sent to every provider in this package.
  </p><button onClick={onClose} className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white">Done</button></div>;
}
