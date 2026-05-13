import { todayInputDate } from "@/lib/bookingDate";
import type { BookingFormData } from "@/types/booking";

type Props = {
  value: BookingFormData;
  onChange: (value: BookingFormData) => void;
};

export default function BookingDateFields({ value, onChange }: Props) {
  return (
    <>
      <label className="text-sm font-semibold text-stone-800">
        Event Date
        <input
          required
          min={todayInputDate()}
          type="date"
          value={value.event_date}
          onChange={(event) => onChange({ ...value, event_date: event.target.value })}
          className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
        />
      </label>
      <label className="text-sm font-semibold text-stone-800">
        Event Time
        <input
          required
          type="time"
          value={value.event_time}
          onChange={(event) => onChange({ ...value, event_time: event.target.value })}
          className="mt-1 w-full border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
        />
      </label>
    </>
  );
}
