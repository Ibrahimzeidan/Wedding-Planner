import { adminRequest } from "@/lib/adminApi";
import type { AdminAIRecommendation, AdminCustomer, AdminNotification } from "@/types/admin";
import type { CustomerPayload } from "@/types/admin";

export function getAdminCustomers() {
  return adminRequest<AdminCustomer[]>("/admin/customers");
}

export function updateAdminCustomer(id: number, payload: CustomerPayload) {
  return adminRequest<AdminCustomer>(`/admin/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminCustomer(id: number) {
  return adminRequest<{ message: string }>(`/admin/customers/${id}`, { method: "DELETE" });
}

export function getAdminNotifications() {
  return adminRequest<AdminNotification[]>("/admin/notifications");
}

export function readAdminNotification(id: number) {
  return adminRequest<AdminNotification>(`/admin/notifications/${id}/read`, { method: "PUT" });
}

export function deleteAdminNotification(id: number) {
  return adminRequest<{ message: string }>(`/admin/notifications/${id}`, { method: "DELETE" });
}

export function getAdminAIRecommendations() {
  return adminRequest<AdminAIRecommendation[]>("/admin/ai-recommendations");
}

export function deleteAdminAIRecommendation(id: number) {
  return adminRequest<{ message: string }>(`/admin/ai-recommendations/${id}`, { method: "DELETE" });
}
