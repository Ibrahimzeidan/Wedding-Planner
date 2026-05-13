"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import { ApiError } from "@/lib/packageRequest";
import { startConversation } from "@/lib/messagesApi";

type Props = {
  providerId: number;
  label?: string;
  className?: string;
};

export default function MessageProviderButton({ providerId, label = "Message Provider", className }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function openChat() {
    setError("");
    if (!getAuthSession()) {
      router.push(`/login?returnTo=/providers/${providerId}`);
      return;
    }
    setIsLoading(true);
    try {
      const conversation = await startConversation(providerId);
      router.push(`/dashboard/customer/messages?conversation=${conversation.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthSession();
        router.push(`/login?returnTo=/providers/${providerId}`);
        return;
      }
      setError(err instanceof Error ? err.message : "Could not open chat.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={openChat} disabled={isLoading} className={className}>
        {isLoading ? "Opening..." : label}
      </button>
      {error && <span className="block w-full text-xs font-semibold text-red-700">{error}</span>}
    </>
  );
}
