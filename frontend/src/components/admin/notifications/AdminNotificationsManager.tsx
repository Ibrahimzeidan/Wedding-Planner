"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import NotificationsTable from "@/components/admin/notifications/NotificationsTable";
import { deleteAdminNotification, getAdminNotifications, readAdminNotification } from "@/lib/adminControlApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminNotification, UiMessage } from "@/types/admin";

export default function AdminNotificationsManager() {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [message, setMessage] = useState<UiMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setItems(await getAdminNotifications());
  }

  useEffect(() => { load().catch(showError).finally(() => setIsLoading(false)); }, []);
  const shown = useMemo(() => items.filter((item) => matchesAdminSearch(item, search)), [items, search]);

  async function markRead(item: AdminNotification) {
    await readAdminNotification(item.id);
    setMessage({ type: "success", text: "Notification marked as read." });
    await load();
  }

  async function remove(item: AdminNotification) {
    if (!window.confirm(`Delete notification "${item.title}"?`)) return;
    await deleteAdminNotification(item.id);
    setMessage({ type: "success", text: "Notification deleted successfully." });
    await load();
  }

  function showError(error: unknown) {
    setMessage({ type: "error", text: error instanceof Error ? error.message : "Action failed." });
  }

  return (
    <AdminLayout title="Notifications" description="View, mark as read, and delete system notifications.">
      {message && <AdminNotice message={message} />}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search notifications by title, message, type, status, user..." />
      </div>
      {isLoading ? <p className="text-sm text-stone-600">Loading notifications...</p> :
        <NotificationsTable notifications={shown} onDelete={remove} onRead={markRead} />}
    </AdminLayout>
  );
}
