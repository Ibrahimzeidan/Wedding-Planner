"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AIChatBox from "@/components/ai/AIChatBox";

export default function CustomerAIPlannerPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => (
        <main className="min-h-screen bg-[#efefef] px-4 py-10 sm:px-6 lg:px-8">
          <section className="mx-auto max-w-7xl">
            <div className="mb-6 border border-[#111111]/10 bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#111111]">AI Planner</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Build a budget-aware wedding package from real approved providers.
              </p>
            </div>
            <AIChatBox />
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}
