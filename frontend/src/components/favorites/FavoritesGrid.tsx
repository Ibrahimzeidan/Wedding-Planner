import FavoriteCard from "@/components/favorites/FavoriteCard";
import type { Favorite } from "@/types/favorite";

type Props = {
  favorites: Favorite[];
  onRemoved: (favoriteId: number) => void;
};

export default function FavoritesGrid({ favorites, onRemoved }: Props) {
  if (!favorites.length) {
    return (
      <div className="border border-[#111111]/10 bg-white p-8 text-center shadow-soft">
        <h2 className="text-xl font-semibold text-[#111111]">No favorites yet</h2>
        <p className="mt-2 text-sm text-stone-600">
          Browse services or packages and tap the heart on anything you want to compare later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} onRemoved={onRemoved} />
      ))}
    </div>
  );
}
