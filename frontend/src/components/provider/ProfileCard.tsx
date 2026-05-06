"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Pencil, ShieldCheck, Tag } from "lucide-react";
import ProfileImageUpload from "@/components/provider/ProfileImageUpload";
import { getAuthSession, getProviderCategory, type AuthSession } from "@/lib/auth";

export default function ProfileCard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const currentSession = getAuthSession();

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    if (currentSession.user.role !== "service_provider") {
      router.replace("/");
      return;
    }

    setSession(currentSession);
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <p className="border border-[#111111]/10 bg-white px-5 py-3 text-sm font-medium text-stone-600 shadow-soft">
        Checking your provider profile...
      </p>
    );
  }

  if (!session) {
    return null;
  }

  const category = getProviderCategory(session.user.email);
  const imageStorageKey = `provider-profile-image:${session.user.email.toLowerCase()}`;

  return (
    <article className="w-full max-w-2xl border border-[#111111]/10 bg-white p-6 text-center shadow-soft sm:p-8">
      <ProfileImageUpload storageKey={imageStorageKey} name={session.user.full_name} />

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase text-stone-500">Service provider profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">{session.user.full_name}</h1>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-stone-600">
          <span className="inline-flex items-center gap-2">
            <Mail size={16} className="text-[#111111]" aria-hidden="true" />
            {session.user.email}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-event-paper px-3 py-1 font-semibold text-[#111111] ring-1 ring-[#111111]/10">
            <Tag size={14} aria-hidden="true" />
            {category}
          </span>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-stone-600">
          This profile is the starting point for your public service provider presence. You can add business details,
          packages, availability, and richer profile information later.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <Pencil size={17} aria-hidden="true" />
          Edit Profile
        </button>
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#111111]/15 bg-white px-5 py-3 text-sm font-semibold text-stone-700">
          <ShieldCheck size={17} className="text-[#111111]" aria-hidden="true" />
          Provider Account
        </div>
      </div>
    </article>
  );
}
