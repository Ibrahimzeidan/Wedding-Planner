import { CalendarCheck } from "lucide-react";
import EmptyStatePage from "@/components/shared/EmptyStatePage";

export default function BookingsPage() {
  return (
    <EmptyStatePage
      eyebrow="Bookings"
      title="My Bookings"
      description="Your booked services will appear here."
      emptyTitle="No bookings yet"
      emptyDescription="When you request or confirm a wedding service, it will be listed here for easy tracking."
      actionLabel="Explore Dashboard"
      actionHref="/dashboard/customer"
      icon={CalendarCheck}
    />
  );
}
