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
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
          <div className="border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-sm font-semibold uppercase text-stone-500">Admin dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              {description}
            </p>
            <div className="mt-6">
              <AdminNav />
            </div>
          </div>

          <div className="mt-6">{children}</div>
        </section>
      )}
    </ProtectedRoute>
  );
}
