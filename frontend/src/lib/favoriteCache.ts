import { getFavorites } from "@/lib/favoritesApi";

let cachedIds: Set<number> | null = null;
let idsPromise: Promise<Set<number>> | null = null;

export async function getFavoriteIds() {
  if (cachedIds) return cachedIds;
  if (!idsPromise) {
    idsPromise = getFavorites()
      .then((items) => {
        cachedIds = new Set(items.flatMap((item) => item.provider_id ? [item.provider_id] : []));
        return cachedIds;
      })
      .catch((error) => {
        idsPromise = null;
        throw error;
      });
  }
  return idsPromise;
}

export function rememberFavorite(providerId: number, favorited: boolean) {
  cachedIds = cachedIds ?? new Set();
  favorited ? cachedIds.add(providerId) : cachedIds.delete(providerId);
}
