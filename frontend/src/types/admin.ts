import type { UserRole } from "@/lib/auth";

export type AdminStats = {
  total_users: number;
  total_customers: number;
  total_service_providers: number;
  total_categories: number;
  total_bookings: number;
  total_reviews: number;
};

export type AdminCategory = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
};

export type CategoryPayload = {
  name: string;
  description?: string | null;
};

export type AdminProvider = {
  id: number;
  user_id: number;
  category_id: number;
  provider_name: string;
  email: string;
  category_name: string;
  business_name: string | null;
  is_approved: boolean;
  created_at: string;
};

export type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type UiMessage = {
  type: "success" | "error";
  text: string;
};
