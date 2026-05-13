import { apiBaseUrl, getApiErrorMessage, getAuthSession } from "@/lib/auth";
import type { AccountResponse, PasswordPayload } from "@/types/account";

async function accountRequest<T>(path: string, options: RequestInit = {}) {
  const session = getAuthSession();
  if (!session) throw new Error("Please log in again.");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(await getApiErrorMessage(response));
  return response.json() as Promise<T>;
}

export function getMyAccount() {
  return accountRequest<AccountResponse>("/account/me");
}

export function updateMyAccount(payload: object) {
  return accountRequest<AccountResponse>("/account/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateMyPhoto(profile_image: string) {
  return accountRequest<AccountResponse>("/account/photo", {
    method: "PUT",
    body: JSON.stringify({ profile_image }),
  });
}

export function updateMyPassword(payload: PasswordPayload) {
  return accountRequest<{ success: boolean; message: string }>("/account/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
