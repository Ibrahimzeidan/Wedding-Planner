import type { ServicePackage, ServiceProvider } from "@/types/services";

export type PackagePayload = {
  provider_id?: number | null;
  title: string;
  description?: string | null;
  price?: number | null;
  capacity?: number | null;
  duration?: string | null;
  image_url?: string | null;
  is_available: boolean;
  is_active?: boolean;
};

export type ProviderPackage = ServicePackage & {
  is_active: boolean;
  created_at: string;
};

export type WeddingPackageItem = {
  id: number;
  service_provider_id: number;
  service_package_id?: number | null;
  category_name: string;
  item_price: number;
  provider_name?: string | null;
  provider_image?: string | null;
  provider_location?: string | null;
  provider_category?: string | null;
  package_title?: string | null;
};

export type WeddingPackage = {
  id: number;
  title: string;
  description?: string | null;
  total_price: number;
  image_url?: string | null;
  guest_capacity?: number | null;
  is_active: boolean;
  created_at: string;
  items: WeddingPackageItem[];
};

export type WeddingPackagePayload = Omit<WeddingPackage, "id" | "created_at" | "items">;
export type WeddingItemPayload = Omit<WeddingPackageItem, "id" | "provider_name" | "package_title">;
export type ProviderDetails = ServiceProvider & { packages: ServicePackage[] };
