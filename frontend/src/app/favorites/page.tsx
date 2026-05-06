import { Heart } from "lucide-react";
import EmptyStatePage from "@/components/shared/EmptyStatePage";

export default function FavoritesPage() {
  return (
    <EmptyStatePage
      eyebrow="Favorites"
      title="Favorite Services"
      description="Saved services will appear here."
      emptyTitle="No saved services yet"
      emptyDescription="Save halls, photographers, caterers, and other services so you can compare them before booking."
      actionLabel="View Dashboard"
      actionHref="/dashboard/customer"
      icon={Heart}
    />
  );
}
