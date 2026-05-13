"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuthSession } from "@/lib/auth";

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    const role = session.user.role;
    const base = role === "admin" ? "admin" : role === "customer" ? "customer" : "provider";
    router.replace(`/dashboard/${base}/messages`);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#efefef] p-10 text-sm text-stone-600">
      Opening messages...
    </main>
  );
}
