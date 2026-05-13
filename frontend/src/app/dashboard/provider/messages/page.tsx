"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MessagesDashboard from "@/components/messages/MessagesDashboard";

export default function ProviderMessagesPage() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {() => (
        <main className="min-h-screen bg-[#efefef] px-4 py-10">
          <section className="mx-auto max-w-6xl space-y-6">
            <Header />
            <MessagesDashboard role="service_provider" />
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}

function Header() {
  return (
    <div className="border border-[#111111]/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase text-stone-500">Provider dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Customer Messages</h1>
      <p className="mt-2 text-sm text-stone-600">Reply to couples and mark messages read.</p>
    </div>
  );
}
