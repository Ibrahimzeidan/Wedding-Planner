"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import MessagesDashboard from "@/components/messages/MessagesDashboard";

export default function AdminMessagesPage() {
  return (
    <AdminLayout title="Messages" description="View customer and provider conversations.">
      <MessagesDashboard role="admin" />
    </AdminLayout>
  );
}
