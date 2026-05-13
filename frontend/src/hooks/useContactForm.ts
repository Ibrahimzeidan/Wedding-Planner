import { FormEvent, useState } from "react";
import { apiBaseUrl } from "@/lib/auth";

export type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialFormState: ContactFormState = { name: "", email: "", phone: "", message: "" };

export function useContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("The message could not be sent.");

      const data: { message: string } = await response.json();
      setSuccessMessage(data.message);
      setForm(initialFormState);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return { errorMessage, form, handleSubmit, isSending, successMessage, updateField };
}
