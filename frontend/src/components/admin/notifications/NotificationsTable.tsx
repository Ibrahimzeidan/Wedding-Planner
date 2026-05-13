import type { AdminNotification } from "@/types/admin";

type Props = {
  notifications: AdminNotification[];
  onDelete: (item: AdminNotification) => void;
  onRead: (item: AdminNotification) => void;
};

export default function NotificationsTable({ notifications, onDelete, onRead }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-event-paper text-xs uppercase text-stone-500">
            <tr>{["Title", "Message", "Type", "User", "Status", "Created", "Actions"]
              .map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {notifications.map((item) => (
              <tr key={item.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{item.title}</td>
                <td className="max-w-md px-4 py-4">{item.message}</td>
                <td className="px-4 py-4">{item.type}</td>
                <td className="px-4 py-4">#{item.user_id}</td>
                <td className="px-4 py-4">{item.is_read ? "Read" : "Unread"}</td>
                <td className="px-4 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {!item.is_read && <button onClick={() => onRead(item)}
                      className="border px-3 py-1 font-semibold">Mark read</button>}
                    <button onClick={() => onDelete(item)}
                      className="bg-[#111111] px-3 py-1 font-semibold text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!notifications.length && <p className="px-4 py-6 text-sm text-stone-500">No notifications found.</p>}
    </div>
  );
}
