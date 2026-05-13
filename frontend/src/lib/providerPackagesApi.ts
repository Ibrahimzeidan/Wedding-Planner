import { requestJson, withAuth } from "@/lib/packageRequest";
import type { PackagePayload, ProviderPackage } from "@/types/packages";

export function getProviderPackages() {
  return requestJson<ProviderPackage[]>("/provider/packages", withAuth());
}

export function createProviderPackage(payload: PackagePayload) {
  return requestJson<ProviderPackage>("/provider/packages", {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify(payload),
  });
}

export function updateProviderPackage(id: number, payload: Partial<PackagePayload>) {
  return requestJson<ProviderPackage>(`/provider/packages/${id}`, {
    ...withAuth({ method: "PUT" }),
    body: JSON.stringify(payload),
  });
}

export function deleteProviderPackage(id: number) {
  return requestJson<{ message: string }>(`/provider/packages/${id}`, withAuth({ method: "DELETE" }));
}
