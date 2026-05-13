export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";
export type PaymentMethod = "cash" | "credit_card" | "paypal";
export type PaymentStatus = "unpaid" | "paid_cash" | "paid_card" | "paid_paypal";

export type BookingSeed = {
  providerId: number;
  providerName: string;
  packageId?: number;
  packageTitle?: string;
  weddingPackageId?: number;
  totalPrice?: number;
};

export type BookingFormData = {
  event_date: string;
  event_time: string;
  guest_count: string;
  phone_number: string;
  location: string;
  notes: string;
};

export type BookingPayload = {
  provider_id: number;
  package_id?: number;
  wedding_package_id?: number;
  event_date: string;
  guest_count?: number;
  phone_number?: string;
  location: string;
  notes?: string;
  payment_method: PaymentMethod;
};

export type Booking = {
  id: number;
  customer_id: number;
  provider_id?: number | null;
  package_id?: number | null;
  wedding_package_id?: number | null;
  customer_name?: string | null;
  provider_name?: string | null;
  package_title?: string | null;
  wedding_package_title?: string | null;
  event_date?: string | null;
  guest_count?: number | null;
  phone_number?: string | null;
  location?: string | null;
  notes?: string | null;
  total_price: number;
  booking_status: BookingStatus;
  provider_response_note?: string | null;
  customer_confirmed: boolean;
  provider_confirmed: boolean;
  conversation_id?: number | null;
  payment_method?: PaymentMethod | null;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
};
