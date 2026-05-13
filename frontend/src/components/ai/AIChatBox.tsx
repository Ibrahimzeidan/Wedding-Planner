"use client";

import { useEffect, useState } from "react";
import AIInput from "@/components/ai/AIInput";
import AIMessage from "@/components/ai/AIMessage";
import QuickPrompts from "@/components/ai/QuickPrompts";
import RecommendationSummary from "@/components/ai/RecommendationSummary";
import TypingIndicator from "@/components/ai/TypingIndicator";
import { getAIHistory, getAIRecommendations, sendAIChat } from "@/lib/aiApi";
import { getMyWeddingPlan } from "@/lib/weddingPlanApi";
import type { AIRecommendationSummary, ChatMessage as Message } from "@/types/ai";

const greeting: Message = {
  id: "welcome",
  sender: "assistant",
  message: "Tell me your budget, guests, date, and location. I will build a complete package from your database.",
};

function makeMessage(sender: Message["sender"], message: string): Message {
  return { id: `${sender}-${Date.now()}-${Math.random()}`, sender, message };
}

function savedMessages(items: { id: number; sender: Message["sender"]; message: string }[]) {
  return items.map((item) => ({
    id: `saved-${item.id}`,
    sender: item.sender,
    message: item.message,
  }));
}

export default function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [summary, setSummary] = useState<AIRecommendationSummary | null>(null);
  const [weddingPlanId, setWeddingPlanId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getMyWeddingPlan()
      .then(async (plan) => {
        const planId = plan?.id;
        setWeddingPlanId(planId);
        const history = await getAIHistory(planId);
        setMessages(history.messages.length ? savedMessages(history.messages) : [greeting]);
        if (planId) {
          const saved = await getAIRecommendations(planId);
          if (saved.items.length) setSummary(saved);
        }
      })
      .catch((error) => setNotice(error.message));
  }, []);

  async function send(message: string) {
    setMessages((items) => [...items, makeMessage("user", message)]);
    setIsLoading(true);
    setNotice("");
    try {
      const response = await sendAIChat(message, weddingPlanId);
      setMessages((items) => [...items, makeMessage("assistant", response.message)]);
      setSummary((current) => (response.items.length ? response : current));
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
        <div className="border-b border-[#111111]/10 p-5">
          <h2 className="text-xl font-semibold text-[#111111]">AI Wedding Planner</h2>
          <p className="mt-1 text-sm text-stone-600">Complete database-backed packages.</p>
        </div>
        <div className="flex min-h-[420px] flex-col gap-3 bg-white p-5">
          {messages.map((message) => <AIMessage key={message.id} message={message} />)}
          {isLoading && <TypingIndicator />}
        </div>
        <div className="border-t border-[#111111]/10 bg-event-paper p-4">
          <QuickPrompts disabled={isLoading} onPick={send} />
        </div>
        {notice && <p className="bg-red-50 px-5 py-3 text-sm text-red-700">{notice}</p>}
        <AIInput disabled={isLoading} onSend={send} />
      </div>
      <RecommendationSummary summary={summary} />
    </section>
  );
}
