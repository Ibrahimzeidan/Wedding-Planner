"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminNav from "@/components/admin/AdminNav";

type AdminLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AdminLayout({ title, description, children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRole="admin">
      {() => (
        <section className="min-h-screen bg-event-paper">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col lg:flex-row">
            <aside className="bg-[#111111] p-5 text-white lg:min-h-screen lg:w-72 lg:shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Smart Wedding Planner
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Admin Control</h2>
              <div className="mt-6">
                <AdminNav />
              </div>
            </aside>
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <header className="border border-[#111111]/10 bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold uppercase text-stone-500">Admin dashboard</p>
                <h1 className="mt-2 text-3xl font-semibold text-[#111111]">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
              </header>
              <div className="mt-6">{children}</div>
            </main>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}
