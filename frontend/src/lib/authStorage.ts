import type { AuthSession } from "@/lib/authTypes";

const sessionStorageKey = "smartWeddingPlannerAuth";
const providerCategoryStorageKey = "smartWeddingPlannerProviderCategories";
export const authChangedEvent = "smart-wedding-planner-auth-changed";

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  window.dispatchEvent(new Event(authChangedEvent));
}

export function getAuthSession(): AuthSession | null {
  const storedSession = localStorage.getItem(sessionStorageKey);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(sessionStorageKey);
  window.dispatchEvent(new Event(authChangedEvent));
}

export function saveProviderCategory(email: string, category: string) {
  if (!email || !category) {
    return;
  }

  const categories = getProviderCategories();
  categories[email.toLowerCase()] = category;
  localStorage.setItem(providerCategoryStorageKey, JSON.stringify(categories));
}

export function getProviderCategory(email: string) {
  return getProviderCategories()[email.toLowerCase()] ?? "Service Provider";
}

function getProviderCategories(): Record<string, string> {
  const storedCategories = localStorage.getItem(providerCategoryStorageKey);

  if (!storedCategories) {
    return {};
  }

  try {
    return JSON.parse(storedCategories) as Record<string, string>;
  } catch {
    localStorage.removeItem(providerCategoryStorageKey);
    return {};
  }
}
