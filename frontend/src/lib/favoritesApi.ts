import { requestJson, withAuth } from "@/lib/packageRequest";
import type { Favorite } from "@/types/favorite";

export function getFavorites() {
  return requestJson<Favorite[]>("/favorites", withAuth());
}

export function addFavorite(providerId: number) {
  return requestJson<Favorite>(`/favorites/${providerId}`, withAuth({ method: "POST" }));
}

export function removeFavorite(providerId: number) {
  return requestJson<{ message: string }>(
    `/favorites/${providerId}`,
    withAuth({ method: "DELETE" }),
  );
}

export function addPackageFavorite(packageId: number) {
  return requestJson<Favorite>(`/favorites/packages/${packageId}`, withAuth({ method: "POST" }));
}

export function removePackageFavorite(packageId: number) {
  return requestJson<{ message: string }>(
    `/favorites/packages/${packageId}`,
    withAuth({ method: "DELETE" }),
  );
}

export function getAdminFavorites() {
  return requestJson<Favorite[]>("/admin/favorites", withAuth());
}

export function deleteAdminFavorite(id: number) {
  return requestJson<{ message: string }>(`/admin/favorites/${id}`, withAuth({ method: "DELETE" }));
}
