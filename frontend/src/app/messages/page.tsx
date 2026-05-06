import { MessageCircle } from "lucide-react";
import EmptyStatePage from "@/components/shared/EmptyStatePage";

export default function MessagesPage() {
  return (
    <EmptyStatePage
      eyebrow="Messages"
      title="Messages"
      description="Chat with service providers."
      emptyTitle="No messages yet"
      emptyDescription="Your conversations with couples or service providers will appear here once messaging is connected."
      actionLabel="Back To Dashboard"
      actionHref="/account"
      icon={MessageCircle}
    />
  );
}
