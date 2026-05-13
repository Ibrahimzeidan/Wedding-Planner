"use client";

import type { Booking, BookingStatus } from "@/types/booking";

type Props = {
  bookings: Booking[];
  onDelete: (id: number) => void;
  onStatus: (id: number, status: BookingStatus) => void;
};

const statuses: BookingStatus[] = ["pending", "accepted", "rejected", "cancelled", "completed"];

export default function BookingTable({ bookings, onDelete, onStatus }: Props) {
  return (
    <div className="overflow-x-auto border border-[#111111]/10 bg-white shadow-soft">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-event-paper text-xs uppercase text-stone-600">
          <tr>
            {["Customer", "Provider", "Date", "Total", "Status", "Actions"].map((label) => (
              <th key={label} className="px-4 py-3">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-[#111111]/10">
              <td className="px-4 py-3">{booking.customer_name || "-"}</td>
              <td className="px-4 py-3">{booking.provider_name || "-"}</td>
              <td className="px-4 py-3">{booking.event_date?.slice(0, 10) || "-"}</td>
              <td className="px-4 py-3">${Number(booking.total_price || 0).toLocaleString()}</td>
              <td className="px-4 py-3">
                <select
                  value={booking.booking_status}
                  onChange={(event) => onStatus(booking.id, event.target.value as BookingStatus)}
                  className="border px-2 py-1"
                >
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(booking.id)} className="border px-3 py-1 font-semibold">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
