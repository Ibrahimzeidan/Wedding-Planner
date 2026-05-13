"use client";

import { FormEvent } from "react";
import BookingDateFields from "@/components/bookings/BookingDateFields";
import VenueLocationInput from "@/components/bookings/VenueLocationInput";
import type { BookingFormData, BookingSeed } from "@/types/booking";

type Props = {
  seed: BookingSeed;
  value: BookingFormData;
  onChange: (value: BookingFormData) => void;
  onContinue: () => void;
  onCancel: () => void;
};

const fields = [
  ["guest_count", "Guest Count", "number"],
  ["phone_number", "Phone Number", "tel"],
] as const;

export default function BookingForm({ seed, value, onChange, onContinue, onCancel }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onContinue();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase text-stone-500">Selected provider</p>
        <h2 className="text-xl font-semibold text-[#111111]">{seed.providerName}</h2>
        {seed.packageTitle && <p className="text-sm text-stone-600">{seed.packageTitle}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <BookingDateFields value={value} onChange={onChange} />
        {fields.map(([key, label, type]) => (
          <label key={key} className="text-sm font-semibold text-stone-800">
            {label}
            <input
              type={type}
              value={value[key]}
              onChange={(event) => onChange({ ...value, [key]: event.target.value })}
              className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
            />
          </label>
        ))}
        <VenueLocationInput
          value={value.location}
          onChange={(location) => onChange({ ...value, location })}
        />
      </div>
      <label className="block text-sm font-semibold text-stone-800">
        Notes
        <textarea
          value={value.notes}
          onChange={(event) => onChange({ ...value, notes: event.target.value })}
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
