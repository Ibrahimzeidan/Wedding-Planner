import type { RegisterRole } from "@/components/auth/RoleSelector";

export type RegisterFormState = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RegisterRole;
  category: string;
};

export const initialRegisterForm: RegisterFormState = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "customer",
  category: "",
};

export function buildRegisterPayload(form: RegisterFormState) {
  const payload = {
    full_name: form.full_name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    role: form.role,
  };

  return form.role === "service_provider"
    ? { ...payload, category: form.category }
    : payload;
}

export function validateRegisterForm(form: RegisterFormState) {
  if (!form.full_name.trim()) return "Full name is required.";
  if (!form.email.trim()) return "Email address is required.";
  if (!form.password) return "Password is required.";
  if (!form.confirmPassword) return "Confirm password is required.";
  if (form.password !== form.confirmPassword) return "Password and confirm password must match.";
  if (form.role === "service_provider" && !form.category) return "Service category is required.";

  return "";
}
