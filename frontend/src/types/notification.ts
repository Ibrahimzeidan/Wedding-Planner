import type { BookingStatus } from "@/types/booking";

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_booking_id?: number | null;
  related_booking_status?: BookingStatus | null;
  related_provider_id?: number | null;
  created_at: string;
};

export type ProviderNotification = Notification;
export type NotificationBookingAction = "accept" | "decline";
