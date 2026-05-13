import { requestJson, withAuth } from "@/lib/packageRequest";
import type { Notification } from "@/types/notification";

export const getNotifications = () =>
  requestJson<Notification[]>("/notifications", withAuth());

export const markNotificationRead = (id: number) =>
  requestJson<Notification>(`/notifications/${id}/read`, withAuth({ method: "PUT" }));

export const markAllNotificationsRead = () =>
  requestJson<{ message: string }>("/notifications/read-all", withAuth({ method: "PUT" }));

export const getProviderNotifications = getNotifications;
export const markProviderNotificationRead = markNotificationRead;

export const getAdminNotifications = () =>
  requestJson<Notification[]>("/admin/notifications", withAuth());

export const deleteAdminNotification = (id: number) =>
  requestJson<{ message: string }>(`/admin/notifications/${id}`, withAuth({ method: "DELETE" }));

export const readAdminNotification = (id: number) =>
  requestJson<Notification>(`/admin/notifications/${id}/read`, withAuth({ method: "PUT" }));
