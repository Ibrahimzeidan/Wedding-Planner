import { requestJson, withAuth } from "@/lib/packageRequest";
import type { Booking, BookingPayload, BookingStatus, PaymentStatus } from "@/types/booking";

type AdminBookingUpdate = {
  booking_status?: BookingStatus;
  payment_status?: PaymentStatus;
};

export function createBooking(payload: BookingPayload) {
  return requestJson<Booking>("/bookings", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
}

export function createBulkBookings(payload: BookingPayload[]) {
  return requestJson<Booking[]>("/bookings/bulk", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
}

export const getMyBookings = () => requestJson<Booking[]>("/bookings/me", withAuth());
export const cancelBooking = (id: number) =>
  requestJson<{ message: string }>(`/bookings/${id}`, withAuth({ method: "DELETE" }));

export const getProviderBookings = () =>
  requestJson<Booking[]>("/provider/bookings", withAuth());

export function updateProviderBooking(id: number, booking_status: BookingStatus) {
  return requestJson<Booking>(`/provider/bookings/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify({ booking_status }),
  });
}

export function acceptProviderBooking(id: number, provider_response_note?: string) {
  return providerAction(id, "accept", provider_response_note);
}

export function rejectProviderBooking(id: number, provider_response_note?: string) {
  return providerAction(id, "reject", provider_response_note);
}

export const completeProviderBooking = (id: number) =>
  requestJson<Booking>(`/provider/bookings/${id}/complete`, withAuth({ method: "PUT" }));

function providerAction(id: number, action: "accept" | "reject", provider_response_note?: string) {
  return requestJson<Booking>(`/provider/bookings/${id}/${action}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify({ provider_response_note }),
  });
}

export const getAdminBookings = () => requestJson<Booking[]>("/admin/bookings", withAuth());
export const deleteAdminBooking = (id: number) =>
  requestJson<{ message: string }>(`/admin/bookings/${id}`, withAuth({ method: "DELETE" }));

export function updateAdminBooking(id: number, payload: AdminBookingUpdate) {
  return requestJson<Booking>(`/admin/bookings/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
}
