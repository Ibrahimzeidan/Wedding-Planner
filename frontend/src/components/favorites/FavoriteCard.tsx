import Link from "next/link";
import { Gift, MapPin, Star } from "lucide-react";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import PackageFavoriteButton from "@/components/favorites/PackageFavoriteButton";
import type { Favorite } from "@/types/favorite";

const fallback = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80";

type Props = {
  favorite: Favorite;
  onRemoved: (favoriteId: number) => void;
};

export default function FavoriteCard({ favorite, onRemoved }: Props) {
  const isPackage = favorite.favorite_type === "package";
  const title = isPackage ? favorite.package_title : favorite.provider_name;
  const href = isPackage ? `/packages/${favorite.package_id}` : `/providers/${favorite.provider_id}`;

  return (
    <article className="overflow-hidden bg-white shadow-soft">
      <div className="relative">
        <img src={favorite.image_url || fallback} alt={title || "Favorite"} className="h-48 w-full object-cover" />
        {isPackage ? (
          <PackageFavoriteButton packageId={favorite.package_id || 0} initialFavorited
            className="absolute right-3 top-3" onChanged={(active) => !active && onRemoved(favorite.id)} />
        ) : (
          <FavoriteButton providerId={favorite.provider_id || 0} initialFavorited
            className="absolute right-3 top-3" onChanged={(active) => !active && onRemoved(favorite.id)} />
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-base font-semibold text-[#111111]">{title}</h3>
        <p className="text-sm font-medium text-stone-700">{favorite.category_name}</p>
        {isPackage ? (
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <Gift className="h-3.5 w-3.5" /> Curated package
          </p>
        ) : (
          <>
            <p className="flex items-center gap-1 text-xs text-stone-600">
              <MapPin className="h-3.5 w-3.5" /> {favorite.location || "Location available soon"}
            </p>
            <p className="flex items-center gap-1 text-xs font-semibold text-stone-800">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {favorite.rating} rating
            </p>
          </>
        )}
        <Link href={href}
          className="inline-flex rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
          View Details
        </Link>
      </div>
    </article>
  );
}
