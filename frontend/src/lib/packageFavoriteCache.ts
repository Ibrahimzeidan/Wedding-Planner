import { getFavorites } from "@/lib/favoritesApi";

let cachedIds: Set<number> | null = null;
let idsPromise: Promise<Set<number>> | null = null;

export async function getPackageFavoriteIds() {
  if (cachedIds) return cachedIds;
  if (!idsPromise) {
    idsPromise = getFavorites()
      .then((items) => {
        cachedIds = new Set(items.flatMap((item) => item.package_id ? [item.package_id] : []));
        return cachedIds;
      })
      .catch((error) => {
        idsPromise = null;
        throw error;
      });
  }
  return idsPromise;
}

export function rememberPackageFavorite(packageId: number, favorited: boolean) {
  cachedIds = cachedIds ?? new Set();
  favorited ? cachedIds.add(packageId) : cachedIds.delete(packageId);
}
