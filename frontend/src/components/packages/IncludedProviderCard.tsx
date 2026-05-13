"use client";

import Link from "next/link";
import BookingFlow from "@/components/bookings/BookingFlow";
import MessageProviderButton from "@/components/messages/MessageProviderButton";
import type { WeddingPackageItem } from "@/types/packages";

const fallback = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80";

type Props = {
  item: WeddingPackageItem;
};

export default function IncludedProviderCard({ item }: Props) {
  const name = item.provider_name || "Service provider";

  return (
    <article className="overflow-hidden border border-[#111111]/10 bg-white text-sm shadow-sm">
      <img src={item.provider_image || fallback} alt={name} className="h-40 w-full object-cover" />
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase text-stone-500">{item.provider_category || item.category_name}</p>
        <h3 className="text-base font-semibold text-[#111111]">{name}</h3>
        <p className="text-stone-600">{item.package_title || "Included service"}</p>
        <p className="text-stone-500">{item.provider_location || "Location available soon"}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href={`/providers/${item.service_provider_id}`} className="border px-3 py-2 font-semibold">
            View Provider
          </Link>
          <MessageProviderButton
            providerId={item.service_provider_id}
            label="Message"
            className="border px-3 py-2 font-semibold"
          />
          <BookingFlow
            seed={{
              providerId: item.service_provider_id,
              providerName: name,
              packageId: item.service_package_id || undefined,
              packageTitle: item.package_title || item.category_name,
              totalPrice: item.item_price,
            }}
            label="Book"
            className="bg-[#111111] px-3 py-2 font-semibold text-white"
          />
        </div>
      </div>
    </article>
  );
}
