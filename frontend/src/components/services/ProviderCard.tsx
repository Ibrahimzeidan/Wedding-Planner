import Link from "next/link";
import { MapPin } from "lucide-react";
import BookingFlow from "@/components/bookings/BookingFlow";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import RatingStars from "@/components/reviews/RatingStars";
import type { ServiceProvider } from "@/types/services";

const fallbackImage = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80";

type ProviderCardProps = {
  provider: ServiceProvider;
  href?: string;
};

export default function ProviderCard({ provider, href = "#" }: ProviderCardProps) {
  const name = provider.business_name || provider.full_name;
  const image = provider.package_image || provider.profile_image || fallbackImage;

  return (
    <article className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <FavoriteButton providerId={provider.id} className="absolute right-3 top-3 z-10" />
      <Link href={href} className="block">
        <img src={image} alt={name} className="h-48 w-full object-cover" />
        <div className="space-y-2 p-4">
          <h3 className="text-sm font-semibold text-stone-950">{name}</h3>
          <p className="min-h-10 text-sm font-medium text-stone-700">
            {provider.package_title || provider.category_name}
          </p>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <MapPin className="h-3.5 w-3.5" />
            {provider.location || "Location available soon"}
          </p>
          <div className="flex items-center gap-1 text-xs text-stone-800">
            <RatingStars value={Math.round(provider.rating || 0)} small />
            <span className="font-semibold">{provider.rating.toFixed(1)} ({provider.review_count})</span>
          </div>
          {provider.package_price && (
            <p className="text-sm font-semibold text-stone-950">${provider.package_price.toLocaleString()}</p>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <BookingFlow
          seed={{
            providerId: provider.id,
            providerName: name,
            packageTitle: provider.package_title || undefined,
            totalPrice: provider.package_price || 0,
          }}
          label="Book Now"
          className="w-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
        />
      </div>
    </article>
  );
}
