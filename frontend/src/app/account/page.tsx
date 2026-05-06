"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuthSession, getAuthSession, getRoleLabel, type AuthSession } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const currentSession = getAuthSession();

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    setSession(currentSession);
    setIsCheckingSession(false);
  }, [router]);

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  if (isCheckingSession) {
    return (
      <section className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 xl:px-10">
        <p className="text-sm font-medium text-stone-600">Checking your account...</p>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 xl:px-10">
      <div className="border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase text-stone-500">My account</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#111111] sm:text-5xl">{session.user.full_name}</h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">{session.user.email}</p>
          </div>

          <span className="inline-flex w-fit rounded-full border border-[#111111]/15 bg-event-paper px-4 py-2 text-sm font-semibold text-[#111111]">
            {getRoleLabel(session.user.role)}
          </span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#111111]/10 bg-event-paper p-4">
            <p className="text-xs font-semibold uppercase text-stone-500">User ID</p>
            <p className="mt-2 text-lg font-semibold text-[#111111]">#{session.user.id}</p>
          </div>
          <div className="border border-[#111111]/10 bg-event-paper p-4">
            <p className="text-xs font-semibold uppercase text-stone-500">Account type</p>
            <p className="mt-2 text-lg font-semibold text-[#111111]">{getRoleLabel(session.user.role)}</p>
          </div>
          <div className="border border-[#111111]/10 bg-event-paper p-4">
            <p className="text-xs font-semibold uppercase text-stone-500">Status</p>
            <p className="mt-2 text-lg font-semibold text-green-700">Logged in</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex justify-center rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
          >
            Go Home
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex justify-center rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-[#111111]"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
