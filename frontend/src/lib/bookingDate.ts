import type { BookingFormData } from "@/types/booking";

export function todayInputDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

export function combineBookingDateTime(form: BookingFormData) {
  return `${form.event_date}T${form.event_time}:00`;
}

export function validateBookingForm(form: BookingFormData) {
  if (!form.event_date || !form.event_time) return "Please choose a valid event date and time.";
  if (!form.location.trim()) return "Please enter the wedding venue location.";
  if (new Date(combineBookingDateTime(form)) <= new Date()) {
    return "Please choose a future event date and time.";
  }
  return "";
}

export function displayBookingDateTime(form: BookingFormData) {
  if (!form.event_date || !form.event_time) return "Not selected";
  return new Date(combineBookingDateTime(form)).toLocaleString();
}
