import type { BookingStatus } from "@/types/booking";

const statusStyle: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-stone-200 text-stone-700",
  completed: "bg-sky-100 text-sky-800",
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[status]}`}>
      {status}
    </span>
  );
}
