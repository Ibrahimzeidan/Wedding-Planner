import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import BookingFlow from "@/components/bookings/BookingFlow";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import RatingStars from "@/components/reviews/RatingStars";
import type { ServiceProvider } from "@/types/services";

const fallbackImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";

type VenueCardProps = {
  venue: ServiceProvider;
};

export default function VenueCard({ venue }: VenueCardProps) {
  const name = venue.business_name || venue.full_name;
  const image = venue.package_image || venue.profile_image || fallbackImage;

  return (
    <article className="relative overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <FavoriteButton providerId={venue.id} className="absolute right-3 top-3 z-10" />
      <Link href={`/providers/${venue.id}`} className="block">
        <img src={image} alt={name} className="h-48 w-full object-cover" />
        <div className="space-y-2 p-4">
          <h3 className="text-sm font-semibold text-stone-950">{name}</h3>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <MapPin className="h-3.5 w-3.5" />
            {venue.location || "Location available soon"}
          </p>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <Users className="h-3.5 w-3.5" />
            Up to {venue.max_guests || 300} guests
          </p>
          <div className="flex items-center gap-1 text-xs text-stone-800">
            <RatingStars value={Math.round(venue.rating || 0)} small />
            <span className="font-semibold">{venue.rating.toFixed(1)} ({venue.review_count})</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <BookingFlow
          seed={{
            providerId: venue.id,
            providerName: name,
            packageTitle: venue.package_title || undefined,
            totalPrice: venue.package_price || 0,
          }}
          label="Request Booking"
          className="w-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
        />
      </div>
    </article>
  );
}
