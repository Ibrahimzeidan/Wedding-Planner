"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProviderPackagesEditor from "@/components/provider-packages/ProviderPackagesEditor";

export default function ProviderPackagesManager() {
  return (
    <ProtectedRoute allowedRole="service_provider">
      {() => (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold text-[#111111]">Provider Packages</h1>
          <ProviderPackagesEditor />
        </section>
      )}
    </ProtectedRoute>
  );
}
