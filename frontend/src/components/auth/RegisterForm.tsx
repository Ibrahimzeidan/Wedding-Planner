"use client";

import FormMessage from "@/components/auth/FormMessage";
import RegisterFields from "@/components/auth/RegisterFields";
import Button from "@/components/ui/Button";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterForm() {
  const formState = useRegisterForm();

  return (
    <form onSubmit={formState.handleSubmit} className="mt-5 grid gap-3.5 sm:mt-6 sm:gap-4">
      <RegisterFields
        form={formState.form}
        onFieldChange={formState.updateField}
        onRoleChange={formState.updateRole}
      />
      <FormMessage message={formState.successMessage} type="success" />
      <FormMessage message={formState.errorMessage} type="error" />
      <Button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full"
      >
        {formState.isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
