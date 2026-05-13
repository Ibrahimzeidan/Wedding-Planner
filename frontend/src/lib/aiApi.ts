import { requestJson, withAuth } from "@/lib/packageRequest";
import type { AIChatResponse, AIHistoryResponse, AIRecommendationSummary, AIReplacementResponse } from "@/types/ai";

export function sendAIChat(message: string, weddingPlanId?: number) {
  return requestJson<AIChatResponse>("/ai/chat", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify({ message, wedding_plan_id: weddingPlanId }),
  });
}

export function getAIRecommendations(weddingPlanId: number) {
  return requestJson<AIRecommendationSummary>(
    `/ai/recommendations/${weddingPlanId}`,
    withAuth(),
  );
}

export function getAIHistory(weddingPlanId?: number) {
  const query = weddingPlanId ? `?wedding_plan_id=${weddingPlanId}` : "";
  return requestJson<AIHistoryResponse>(`/ai/history${query}`, withAuth());
}

export function createAIRecommendations(weddingPlanId: number) {
  return requestJson<AIRecommendationSummary>(`/ai/recommendations/${weddingPlanId}`, {
    ...withAuth({ method: "POST" }),
  });
}

export function findReplacementProvider(bookingId: number) {
  return requestJson<AIReplacementResponse>(`/ai/recommendations/replacement/${bookingId}`, {
    ...withAuth({ method: "POST" }),
  });
}
