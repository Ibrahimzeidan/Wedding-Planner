import Link from "next/link";
import PackageFavoriteButton from "@/components/favorites/PackageFavoriteButton";
import type { WeddingPackage } from "@/types/packages";

const fallback = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80";

type Props = { item: WeddingPackage };

export default function PackageCard({ item }: Props) {
  return (
    <article className="relative overflow-hidden bg-white shadow-soft">
      <PackageFavoriteButton packageId={item.id} className="absolute right-3 top-3 z-10" />
      <img src={item.image_url || fallback} alt={item.title} className="h-52 w-full object-cover" />
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-semibold text-[#111111]">{item.title}</h2>
        <p className="line-clamp-3 text-sm leading-6 text-stone-600">{item.description || "A complete wedding package curated by our team."}</p>
        <p className="text-sm text-stone-600">Up to {item.guest_capacity || 100} guests</p>
        <p className="text-xl font-semibold text-[#111111]">${Number(item.total_price).toLocaleString()}</p>
        <Link href={`/packages/${item.id}`} className="inline-flex bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
          View Details
        </Link>
      </div>
    </article>
  );
}
