"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MessagesDashboard from "@/components/messages/MessagesDashboard";

export default function CustomerMessagesPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => (
        <main className="min-h-screen bg-[#efefef] px-4 py-10">
          <section className="mx-auto max-w-6xl space-y-6">
            <Header />
            <MessagesDashboard role="customer" />
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}

function Header() {
  return (
    <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Messages</h1>
      <p className="mt-2 text-sm text-stone-600">Open conversations and message providers.</p>
    </div>
  );
}
