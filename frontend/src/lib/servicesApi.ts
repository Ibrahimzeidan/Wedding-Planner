import { apiBaseUrl, getApiErrorMessage } from "@/lib/api";
import type { ServiceCategory, ServiceFilters, ServiceProvider, VenueFilters } from "@/types/services";

function queryString(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(await getApiErrorMessage(response));
  return response.json();
}

export function fetchServiceCategories() {
  return fetchJson<ServiceCategory[]>("/services/categories");
}

export function fetchServiceProviders(filters: ServiceFilters = {}) {
  const query = queryString(filters);
  return fetchJson<ServiceProvider[]>(`/services/providers${query ? `?${query}` : ""}`);
}

export function fetchVenues(filters: VenueFilters = {}) {
  const query = queryString(filters);
  return fetchJson<ServiceProvider[]>(`/venues${query ? `?${query}` : ""}`);
}
