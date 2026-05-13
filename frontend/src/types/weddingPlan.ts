export type WeddingPlan = {
  id: number;
  customer_id: number;
  wedding_date?: string | null;
  budget?: number | null;
  guest_count?: number | null;
  location?: string | null;
  wedding_style?: string | null;
  preferred_services: string[];
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
};

export type WeddingPlanPayload = {
  wedding_date?: string | null;
  budget?: number | null;
  guest_count?: number | null;
  location?: string | null;
  wedding_style?: string | null;
  preferred_services: string[];
};
