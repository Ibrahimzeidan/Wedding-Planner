import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { RegisterRole } from "@/components/auth/RoleSelector";
import {
  buildRegisterPayload,
  initialRegisterForm,
  validateRegisterForm,
  type RegisterFormState,
} from "@/components/auth/registerFormUtils";
import {
  apiBaseUrl,
  getApiErrorMessage,
  getDashboardPath,
  getRequestErrorMessage,
  saveAuthSession,
  saveProviderCategory,
  type AuthSession,
} from "@/lib/auth";

export function useRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field: keyof RegisterFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateRole(role: RegisterRole) {
    setForm((current) => ({
      ...current,
      role,
      category: role === "customer" ? "" : current.category,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationMessage = validateRegisterForm(form);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRegisterPayload(form)),
      });
      if (!response.ok) throw new Error(await getApiErrorMessage(response));
      await loginAfterRegister();
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "Registration failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginAfterRegister() {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
    });

    if (!response.ok) {
      setSuccessMessage("Account created successfully. Please log in.");
      router.push("/login");
      return;
    }

    const session: AuthSession = await response.json();
    saveAuthSession(session);
    if (form.role === "service_provider") saveProviderCategory(session.user.email, form.category);
    setSuccessMessage("Account created successfully. Opening your account...");
    router.push(getDashboardPath(session.user.role));
  }

  return { errorMessage, form, handleSubmit, isSubmitting, successMessage, updateField, updateRole };
}
