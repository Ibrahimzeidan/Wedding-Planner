import type { UserRole } from "@/lib/authTypes";

export function getRoleLabel(role: UserRole) {
  if (role === "service_provider") {
    return "Service provider";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function getDashboardPath(role: UserRole) {
  if (role === "service_provider") {
    return "/dashboard/provider";
  }

  if (role === "admin") {
    return "/dashboard/admin";
  }

  return "/dashboard/customer";
}

export function isDashboardRole(role: UserRole): role is UserRole {
  return role === "customer" || role === "service_provider" || role === "admin";
}
