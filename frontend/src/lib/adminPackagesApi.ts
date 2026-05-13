import { requestJson, withAuth } from "@/lib/packageRequest";
import type { PackagePayload, ProviderPackage, WeddingItemPayload } from "@/types/packages";
import type { WeddingPackage, WeddingPackagePayload } from "@/types/packages";

export const getAdminPackages = () => requestJson<ProviderPackage[]>("/admin/packages", withAuth());
export const createAdminPackage = (payload: PackagePayload) =>
  requestJson<ProviderPackage>("/admin/packages", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
export const updateAdminPackage = (id: number, payload: Partial<PackagePayload>) =>
  requestJson<ProviderPackage>(`/admin/packages/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
export const deleteAdminPackage = (id: number) =>
  requestJson<{ message: string }>(`/admin/packages/${id}`, withAuth({ method: "DELETE" }));

export const getAdminWeddingPackages = () =>
  requestJson<WeddingPackage[]>("/admin/wedding-packages", withAuth());
export const createWeddingPackage = (payload: WeddingPackagePayload) =>
  requestJson<WeddingPackage>("/admin/wedding-packages", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
export const updateWeddingPackage = (id: number, payload: Partial<WeddingPackagePayload>) =>
  requestJson<WeddingPackage>(`/admin/wedding-packages/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
export const deleteWeddingPackage = (id: number) =>
  requestJson<{ message: string }>(`/admin/wedding-packages/${id}`, withAuth({ method: "DELETE" }));
export const addWeddingPackageItem = (id: number, payload: WeddingItemPayload) =>
  requestJson<WeddingPackage>(`/admin/wedding-packages/${id}/items`, {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
export const deleteWeddingPackageItem = (id: number, itemId: number) =>
  requestJson<WeddingPackage>(`/admin/wedding-packages/${id}/items/${itemId}`, withAuth({ method: "DELETE" }));
