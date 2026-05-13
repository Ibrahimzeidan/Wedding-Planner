export type AIRecommendationItem = {
  id?: number | null;
  package_id: number;
  provider_id: number;
  category: string;
  provider: string;
  package: string;
  price: number;
  reason: string;
  rating?: number | null;
  location?: string | null;
  capacity?: number | null;
};

export type AIRecommendationSummary = {
  total_estimated_cost: number;
  remaining_budget?: number | null;
  recommendation_summary?: string | null;
  items: AIRecommendationItem[];
  options?: AIRecommendationOption[];
};

export type AIReplacementData = AIRecommendationItem;

export type AIReplacementResponse = {
  success: boolean;
  message: string;
  data?: AIReplacementData | null;
};

export type AIRecommendationOption = {
  title: string;
  total_estimated_cost: number;
  remaining_budget?: number | null;
  difference: string;
  items: AIRecommendationItem[];
};

export type AIChatResponse = AIRecommendationSummary & {
  conversation_id: number;
  message: string;
};

export type ChatMessage = {
  id: string;
  sender: "user" | "assistant";
  message: string;
};

export type AIStoredMessage = {
  id: number;
  sender: ChatMessage["sender"];
  message: string;
  created_at: string;
};

export type AIHistoryResponse = {
  conversation_id: number;
  messages: AIStoredMessage[];
};
