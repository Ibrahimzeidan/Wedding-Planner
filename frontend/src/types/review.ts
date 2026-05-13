export type Review = {
  id: number;
  customer_id: number;
  provider_id: number;
  booking_id?: number | null;
  rating: number;
  comment?: string | null;
  created_at: string;
  customer_name?: string | null;
  provider_name?: string | null;
};

export type ReviewPayload = {
  booking_id: number;
  rating: number;
  comment: string;
};
