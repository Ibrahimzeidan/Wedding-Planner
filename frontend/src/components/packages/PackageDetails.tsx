"use client";

import Link from "next/link";
import BookingFlow from "@/components/bookings/BookingFlow";
import PackageFavoriteButton from "@/components/favorites/PackageFavoriteButton";
import IncludedProviderCard from "@/components/packages/IncludedProviderCard";
import type { WeddingPackage } from "@/types/packages";

const fallback = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85";

type Props = { item: WeddingPackage };

export default function PackageDetails({ item }: Props) {
  const firstProvider = item.items[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/packages" className="text-sm font-semibold text-stone-700">Back to packages</Link>
      <div className="mt-6 overflow-hidden bg-white shadow-soft">
        <img src={item.image_url || fallback} alt={item.title} className="h-80 w-full object-cover" />
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-3xl font-semibold text-[#111111]">{item.title}</h1>
            <p className="mt-4 leading-7 text-stone-600">{item.description}</p>
          </div>
          <aside className="border border-[#111111]/10 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#111111]">Save package</span>
              <PackageFavoriteButton packageId={item.id} />
            </div>
            <p className="text-sm text-stone-600">Total price</p>
            <p className="text-3xl font-semibold">${Number(item.total_price).toLocaleString()}</p>
            <p className="mt-3 text-sm text-stone-600">Guest capacity: {item.guest_capacity || "-"}</p>
            {firstProvider ? (
              <BookingFlow
                seed={{
                  providerId: firstProvider.service_provider_id,
                  providerName: firstProvider.provider_name || "Selected provider",
                  weddingPackageId: item.id,
                  packageTitle: item.title,
                  totalPrice: item.total_price,
                }}
                label="Request Package"
                className="mt-5 w-full bg-[#111111] px-4 py-3 text-sm font-semibold text-white"
              />
            ) : (
              <button disabled className="mt-5 w-full bg-stone-300 px-4 py-3 text-sm font-semibold">
                Package unavailable
              </button>
            )}
          </aside>
        </div>
        <div className="border-t p-6">
          <h2 className="text-lg font-semibold">Included service providers</h2>
          <p className="mt-2 text-sm text-stone-600">View every provider in this package and message them directly.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {item.items.map((part) => (
              <IncludedProviderCard key={part.id} item={part} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
