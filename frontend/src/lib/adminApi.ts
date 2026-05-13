import { apiBaseUrl, getApiErrorMessage, getAuthSession } from "@/lib/auth";
import type { AdminCategory, AdminProvider, AdminStats, AdminUser } from "@/types/admin";
import type { CategoryPayload, ProviderPayload, UserPayload } from "@/types/admin";

export async function adminRequest<T>(path: string, options: RequestInit = {}) {
  const session = getAuthSession();
  if (!session) {
    throw new Error("Please log in again.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  const payload = await response.json();
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}
export function getAdminStats() {
  return adminRequest<AdminStats>("/admin/stats");
}
export function getAdminCategories() {
  return adminRequest<AdminCategory[]>("/admin/categories");
}
export function createAdminCategory(payload: CategoryPayload) {
  return adminRequest<AdminCategory>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function updateAdminCategory(id: number, payload: CategoryPayload) {
  return adminRequest<AdminCategory>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export function deleteAdminCategory(id: number) {
  return adminRequest<{ message: string }>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}
export function getAdminProviders() {
  return adminRequest<AdminProvider[]>("/admin/providers");
}
export function updateAdminProvider(id: number, payload: ProviderPayload) {
  return adminRequest<AdminProvider>(`/admin/providers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export function deleteAdminProvider(id: number) {
  return adminRequest<{ message: string }>(`/admin/providers/${id}`, {
    method: "DELETE",
  });
}
export function getAdminUsers() {
  return adminRequest<AdminUser[]>("/admin/users");
}
export function createAdminUser(payload: UserPayload) {
  return adminRequest<AdminUser>("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function updateAdminUser(id: number, payload: UserPayload) {
  const { password, category_id, business_name, ...body } = payload;
  return adminRequest<AdminUser>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
export function deleteAdminUser(id: number) {
  return adminRequest<{ message: string }>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
