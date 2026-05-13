import { apiBaseUrl, getApiErrorMessage, getAuthSession } from "@/lib/auth";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function requestJson<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new ApiError(await getApiErrorMessage(response), response.status);
  const payload = await response.json();
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export function withAuth(options: RequestInit = {}) {
  const session = getAuthSession();
  if (!session) throw new Error("Please log in again.");
  return {
    ...options,
    headers: { Authorization: `Bearer ${session.access_token}`, ...options.headers },
  };
}
