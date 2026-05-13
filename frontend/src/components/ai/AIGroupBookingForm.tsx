"use client";

import { FormEvent } from "react";
import BookingDateFields from "@/components/bookings/BookingDateFields";
import VenueLocationInput from "@/components/bookings/VenueLocationInput";
import type { BookingFormData } from "@/types/booking";

type Props = {
  form: BookingFormData;
  onChange: (form: BookingFormData) => void;
  onCancel: () => void;
  onContinue: () => void;
};

const fields = [
  ["guest_count", "Guest Count", "number"],
  ["phone_number", "Phone Number", "tel"],
] as const;

export default function AIGroupBookingForm({ form, onChange, onCancel, onContinue }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onContinue();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <BookingDateFields value={form} onChange={onChange} />
        {fields.map(([key, label, type]) => (
          <label key={key} className="text-sm font-semibold text-stone-800">
            {label}
            <input
              type={type}
              value={form[key]}
              onChange={(event) => onChange({ ...form, [key]: event.target.value })}
              className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
            />
          </label>
        ))}
        <VenueLocationInput
          value={form.location}
          onChange={(location) => onChange({ ...form, location })}
        />
      </div>
      <label className="block text-sm font-semibold text-stone-800">
        Notes for all providers
        <textarea
          value={form.notes}
          onChange={(event) => onChange({ ...form, notes: event.target.value })}
          className="mt-1 min-h-24 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white">
          Continue to Payment
        </button>
        <button type="button" onClick={onCancel} className="border px-5 py-3 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}
