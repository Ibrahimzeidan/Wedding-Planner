import { combineBookingDateTime } from "@/lib/bookingDate";
import type { BookingFormData, BookingPayload, BookingSeed, PaymentMethod } from "@/types/booking";

export const emptyBookingForm: BookingFormData = {
  event_date: "",
  event_time: "",
  guest_count: "",
  phone_number: "",
  location: "",
  notes: "",
};

export function bookingPayload(
  seed: BookingSeed,
  form: BookingFormData,
  payment_method: PaymentMethod,
): BookingPayload {
  return {
    provider_id: seed.providerId,
    package_id: seed.packageId,
    wedding_package_id: seed.weddingPackageId,
    event_date: combineBookingDateTime(form),
    guest_count: form.guest_count ? Number(form.guest_count) : undefined,
    phone_number: form.phone_number || undefined,
    location: form.location.trim(),
    notes: form.notes || undefined,
    payment_method,
  };
}

export function loginReturnPath() {
  return `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
}
