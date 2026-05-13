export function matchesAdminSearch(value: unknown, query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return flattenValue(value).toLowerCase().includes(term);
}

function flattenValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(flattenValue).join(" ");
  if (typeof value === "object") return Object.values(value).map(flattenValue).join(" ");
  return "";
}
