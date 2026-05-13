import { MapPin } from "lucide-react";
import BookingFlow from "@/components/bookings/BookingFlow";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import MessageProviderButton from "@/components/messages/MessageProviderButton";
import ProviderRatingSummary from "@/components/reviews/ProviderRatingSummary";
import type { ProviderDetails } from "@/types/packages";

const fallback = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85";

type Props = { provider: ProviderDetails };

export default function ProviderDetailsHeader({ provider }: Props) {
  const name = provider.business_name || provider.full_name;
  const image = provider.package_image || provider.profile_image || fallback;

  return (
    <section className="overflow-hidden bg-white shadow-soft">
      <img src={image} alt={name} className="h-80 w-full object-cover" />
      <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">{provider.category_name}</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">{name}</h1>
          <p className="mt-4 leading-7 text-stone-600">{provider.description || "Provider details will be updated soon."}</p>
        </div>
        <aside className="space-y-3 border border-[#111111]/10 p-5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[#111111]">Save provider</span>
            <FavoriteButton providerId={provider.id} />
          </div>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{provider.location || "Location available soon"}</p>
          <ProviderRatingSummary rating={provider.rating} count={provider.review_count} compact />
          <MessageProviderButton
            providerId={provider.id}
            className="w-full border px-4 py-2 font-semibold"
          />
          <BookingFlow
            seed={{ providerId: provider.id, providerName: name, totalPrice: provider.package_price || 0 }}
            label="Book Now"
            className="w-full bg-[#111111] px-4 py-2 font-semibold text-white"
          />
        </aside>
      </div>
    </section>
  );
}
