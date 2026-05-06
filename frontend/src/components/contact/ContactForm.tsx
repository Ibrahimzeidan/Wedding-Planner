"use client";

import FormInput from "@/components/auth/FormInput";
import FormMessage from "@/components/auth/FormMessage";
import ContactTextarea from "@/components/contact/ContactTextarea";
import Button from "@/components/ui/Button";
import { useContactForm } from "@/hooks/useContactForm";

export default function ContactForm() {
  const state = useContactForm();

  return (
    <form
      onSubmit={state.handleSubmit}
      className="w-full bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-4 sm:gap-5">
        <FormInput
          label="Name"
          name="name"
          value={state.form.name}
          onChange={(value) => state.updateField("name", value)}
          placeholder="Your name"
          required
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={state.form.email}
          onChange={(value) => state.updateField("email", value)}
          placeholder="you@example.com"
          required
        />
        <ContactTextarea
          value={state.form.message}
          onChange={(value) => state.updateField("message", value)}
        />
        <Button
          type="submit"
          disabled={state.isSending}
          className="w-full sm:w-auto sm:justify-self-start"
        >
          {state.isSending ? "Sending..." : "Send Message"}
        </Button>
        <FormMessage message={state.successMessage} type="success" />
        <FormMessage message={state.errorMessage} type="error" />
      </div>
    </form>
  );
}
