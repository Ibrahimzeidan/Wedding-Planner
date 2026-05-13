"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/auth/FormInput";
import FormMessage from "@/components/auth/FormMessage";
import Button from "@/components/ui/Button";
import {
  apiBaseUrl,
  getApiErrorMessage,
  getDashboardPath,
  getRequestErrorMessage,
  safeReturnTo,
  saveAuthSession,
  type AuthSession,
} from "@/lib/auth";

const initialForm = { email: "", password: "" };

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (!response.ok) throw new Error(await getApiErrorMessage(response));

      const session: AuthSession = await response.json();
      saveAuthSession(session);
      router.push(safeReturnTo(returnToParam()) || getDashboardPath(session.user.role));
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">
      <FormInput
        label="Email address"
        name="email"
        type="email"
        value={form.email}
        onChange={(value) => updateField("email", value)}
        placeholder="you@example.com"
        required
      />
      <FormInput
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={(value) => updateField("password", value)}
        placeholder="Your password"
        required
      />
      <FormMessage message={errorMessage} type="error" />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

function returnToParam() {
  return new URLSearchParams(window.location.search).get("returnTo");
}
