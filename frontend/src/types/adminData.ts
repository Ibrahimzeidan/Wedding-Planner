export type AdminCustomer = {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  location?: string | null;
  guest_count?: number | null;
  budget?: number | null;
  is_active: boolean;
  wedding_plan_count: number;
  booking_count: number;
  favorite_count: number;
};

export type CustomerPayload = Partial<Omit<AdminCustomer, "id" | "user_id">>;

export type AdminNotification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_booking_id?: number | null;
  related_provider_id?: number | null;
  created_at: string;
};

export type AdminAIItem = {
  id: number;
  provider_id: number;
  package_id: number;
  category_name: string;
  provider_name?: string | null;
  package_title?: string | null;
  item_price: number;
  reason: string;
};

export type AdminAIRecommendation = {
  id: number;
  customer_id: number;
  customer_name?: string | null;
  wedding_plan_id: number;
  total_estimated_cost: number;
  remaining_budget?: number | null;
  recommendation_summary?: string | null;
  created_at: string;
  items: AdminAIItem[];
};
