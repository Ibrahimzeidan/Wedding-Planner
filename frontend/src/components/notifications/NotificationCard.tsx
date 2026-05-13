import type { Notification, NotificationBookingAction } from "@/types/notification";

type Props = {
  item: Notification;
  onRead: (id: number) => void;
  onBookingResponse?: (item: Notification, action: NotificationBookingAction) => void;
  isBusy?: boolean;
};

export default function NotificationCard({ item, onRead, onBookingResponse, isBusy = false }: Props) {
  const date = new Date(item.created_at).toLocaleString();
  const canRespond = Boolean(
    item.type === "booking_created" &&
    item.related_booking_id &&
    item.related_booking_status === "pending" &&
    onBookingResponse
  );

  return (
    <article className={`rounded-md border p-4 ${item.is_read ? "bg-white" : "bg-event-paper"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">{item.type.replaceAll("_", " ")}</p>
          <h3 className="mt-1 font-semibold text-[#111111]">{item.title}</h3>
          <p className="mt-1 text-sm text-stone-700">{item.message}</p>
          <p className="mt-2 text-xs text-stone-500">{date}</p>
          {item.type === "booking_created" && item.related_booking_status && item.related_booking_status !== "pending" && (
            <p className="mt-2 text-xs font-semibold uppercase text-stone-500">
              Booking {item.related_booking_status}
            </p>
          )}
        </div>
        {canRespond ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onBookingResponse?.(item, "accept")}
              disabled={isBusy}
              className="rounded-md bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onBookingResponse?.(item, "decline")}
              disabled={isBusy}
              className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        ) : !item.is_read && (
          <button
            type="button"
            onClick={() => onRead(item.id)}
            disabled={isBusy}
            className="rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-50"
          >
            Mark Read
          </button>
        )}
      </div>
    </article>
  );
}
