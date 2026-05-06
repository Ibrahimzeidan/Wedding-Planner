"use client";

import { KeyRound, Pencil, Phone, ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getRoleLabel } from "@/lib/auth";

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      {(session) => (
        <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
          <div className="border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-sm font-semibold uppercase text-stone-500">Account settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">Profile details</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Keep your account information ready. Editing will be connected to the backend later.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="border border-[#111111]/10 bg-white p-5 shadow-soft lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Full name" value={session.user.full_name} />
                <ProfileField label="Email" value={session.user.email} />
                <ProfileField label="Role" value={getRoleLabel(session.user.role)} />
                <ProfileField label="Phone" value="Not added yet" />
              </div>
            </div>

            <div className="grid gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
              >
                <Pencil size={17} aria-hidden="true" />
                Edit Profile
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-[#111111]"
              >
                <KeyRound size={17} aria-hidden="true" />
                Change Password
              </button>
              <div className="border border-[#111111]/10 bg-event-paper p-5">
                <ShieldCheck className="h-8 w-8 text-[#111111]" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-[#111111]">Protected account</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Your login token is stored locally in this browser.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#111111]/10 bg-event-paper p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-stone-500">
        <Phone size={14} className={label === "Phone" ? "block" : "hidden"} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-2 break-words text-base font-semibold text-[#111111]">{value}</p>
    </div>
  );
}
