import { apiBaseUrl, getApiErrorMessage, getAuthSession } from "@/lib/auth";
import type {
  AdminCategory,
  AdminProvider,
  AdminStats,
  AdminUser,
  CategoryPayload,
} from "@/types/admin";

async function adminRequest<T>(path: string, options: RequestInit = {}) {
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

  return response.json() as Promise<T>;
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

export function getAdminUsers() {
  return adminRequest<AdminUser[]>("/admin/users");
}
