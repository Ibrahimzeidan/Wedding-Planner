import { requestJson, withAuth } from "@/lib/packageRequest";
import type { WeddingPlan, WeddingPlanPayload } from "@/types/weddingPlan";

export function getMyWeddingPlan() {
  return requestJson<WeddingPlan | null>("/wedding-plans/me", withAuth());
}

export function createWeddingPlan(payload: WeddingPlanPayload) {
  return requestJson<WeddingPlan>("/wedding-plans", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
}

export function updateWeddingPlan(id: number, payload: WeddingPlanPayload) {
  return requestJson<WeddingPlan>(`/wedding-plans/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
}

export function deleteWeddingPlan(id: number) {
  return requestJson<{ message: string }>(`/wedding-plans/${id}`, withAuth({ method: "DELETE" }));
}

export function getAdminWeddingPlans() {
  return requestJson<WeddingPlan[]>("/admin/wedding-plans", withAuth());
}

export function updateAdminWeddingPlan(id: number, payload: WeddingPlanPayload) {
  return requestJson<WeddingPlan>(`/admin/wedding-plans/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
}

export function deleteAdminWeddingPlan(id: number) {
  return requestJson<{ message: string }>(
    `/admin/wedding-plans/${id}`,
    withAuth({ method: "DELETE" }),
  );
}
