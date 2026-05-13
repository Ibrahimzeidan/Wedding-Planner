export type ServiceCategory = {
  id: number;
  name: string;
  description?: string | null;
};

export type ServiceFilters = {
  category?: string;
  category_id?: string;
  location?: string;
  rating?: string;
  search?: string;
};

export type VenueFilters = ServiceFilters & {
  guests?: string;
  venue_type?: string;
};

export type ServiceProvider = {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  category_id?: number | null;
  business_name?: string | null;
  category_name: string;
  description?: string | null;
  phone?: string | null;
  location?: string | null;
  profile_image?: string | null;
  rating: number;
  review_count: number;
  package_title?: string | null;
  package_price?: number | null;
  package_image?: string | null;
  venue_type?: string | null;
  max_guests?: number | null;
  packages?: ServicePackage[];
};

export type ServicePackage = {
  id: number;
  provider_id: number;
  provider_name: string;
  category_name: string;
  title: string;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  duration?: string | null;
  capacity?: number | null;
  is_available: boolean;
};
