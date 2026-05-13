"use client";

import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { addFavorite, removeFavorite } from "@/lib/favoritesApi";
import { getAuthSession } from "@/lib/auth";
import { getFavoriteIds, rememberFavorite } from "@/lib/favoriteCache";

type Props = {
  providerId: number;
  className?: string;
  initialFavorited?: boolean;
  onChanged?: (favorited: boolean) => void;
};

export default function FavoriteButton({
  providerId,
  className = "",
  initialFavorited = false,
  onChanged,
}: Props) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const session = getAuthSession();
    if (session?.user.role !== "customer") return;
    let isMounted = true;
    getFavoriteIds()
      .then((ids) => isMounted && setIsFavorited(ids.has(providerId)))
      .catch(() => undefined);
    return () => { isMounted = false; };
  }, [providerId]);

  async function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const session = getAuthSession();
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "customer") {
      window.alert("Favorites are available for customer accounts.");
      return;
    }
    try {
      setIsBusy(true);
      const next = !isFavorited;
      next ? await addFavorite(providerId) : await removeFavorite(providerId);
      rememberFavorite(providerId, next);
      setIsFavorited(next);
      onChanged?.(next);
    } catch (error) {
      window.alert((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      disabled={isBusy}
      onClick={toggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm ${className}`}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-stone-800"}`} />
    </button>
  );
}
