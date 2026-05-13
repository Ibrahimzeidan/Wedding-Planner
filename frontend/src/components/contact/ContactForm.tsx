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
      className="rounded-2xl border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-4 sm:gap-5">
        <FormInput
          label="Full Name"
          name="name"
          value={state.form.name}
          onChange={(value) => state.updateField("name", value)}
          placeholder="Name"
          inputClassName={fieldClass}
          required
        />
        <FormInput
          label="Contact Number"
          name="phone"
          value={state.form.phone}
          onChange={(value) => state.updateField("phone", value)}
          placeholder="contact number"
          inputClassName={fieldClass}
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={state.form.email}
          onChange={(value) => state.updateField("email", value)}
          placeholder="you@example.com"
          inputClassName={fieldClass}
          required
        />
        <ContactTextarea
          value={state.form.message}
          onChange={(value) => state.updateField("message", value)}
        />
        <Button
          type="submit"
          disabled={state.isSending}
          className="mt-2 w-full rounded-full px-16 sm:w-auto"
        >
          {state.isSending ? "Sending..." : "Submit"}
        </Button>
        <FormMessage message={state.successMessage} type="success" />
        <FormMessage message={state.errorMessage} type="error" />
      </div>
    </form>
  );
}

const fieldClass = "rounded-xl border border-[#111111]/15 bg-stone-50 px-4 focus:bg-white";
