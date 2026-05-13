export type Favorite = {
  id: number;
  customer_id: number;
  favorite_type: "provider" | "package";
  provider_id?: number | null;
  package_id?: number | null;
  provider_name?: string | null;
  package_title?: string | null;
  category_name: string;
  location?: string | null;
  rating: number;
  image_url?: string | null;
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
};
