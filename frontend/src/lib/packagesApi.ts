import { requestJson } from "@/lib/packageRequest";
import type { ProviderDetails, WeddingPackage } from "@/types/packages";
import type { ServicePackage } from "@/types/services";

export type PublicPackageFilters = { min_price?: string; max_price?: string; guests?: string };

function queryString(filters: PublicPackageFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  return params.toString();
}

export function fetchWeddingPackages(filters: PublicPackageFilters = {}) {
  const query = queryString(filters);
  return requestJson<WeddingPackage[]>(`/packages${query ? `?${query}` : ""}`);
}

export const fetchWeddingPackage = (id: string) => requestJson<WeddingPackage>(`/packages/${id}`);
export const fetchProviderDetails = (id: string) => requestJson<ProviderDetails>(`/providers/${id}`);
export const fetchProviderPackages = (id: string) =>
  requestJson<ServicePackage[]>(`/providers/${id}/packages`);
