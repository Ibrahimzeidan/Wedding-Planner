import type { UserRole } from "@/lib/auth";

export type AdminStats = {
  total_users: number;
  total_customers: number;
  total_service_providers: number;
  total_categories: number;
  total_packages: number;
  total_wedding_packages: number;
  total_wedding_plans: number;
  total_bookings: number;
  total_messages: number;
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
  category_id?: number | null;
  provider_name: string;
  email: string;
  category_name: string;
  business_name: string | null;
  description?: string | null;
  location?: string | null;
  phone?: string | null;
  rating?: number | null;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
};

export type ProviderPayload = Partial<Pick<AdminProvider,
  "category_id" | "business_name" | "description" | "location" |
  "phone" | "rating" | "is_approved" | "is_active"
>>;

export type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type UserPayload = {
  full_name: string;
  email: string;
  password?: string;
  role: UserRole;
  is_active?: boolean;
  category_id?: number | null;
  business_name?: string;
};

export type UiMessage = {
  type: "success" | "error";
  text: string;
};
