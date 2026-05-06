import FormInput from "@/components/auth/FormInput";
import RoleSelector, { type RegisterRole } from "@/components/auth/RoleSelector";
import ServiceCategorySelect from "@/components/auth/ServiceCategorySelect";
import type { RegisterFormState } from "@/components/auth/registerFormUtils";

type RegisterFieldsProps = {
  form: RegisterFormState;
  onFieldChange: (field: keyof RegisterFormState, value: string) => void;
  onRoleChange: (role: RegisterRole) => void;
};

export default function RegisterFields({ form, onFieldChange, onRoleChange }: RegisterFieldsProps) {
  return (
    <>
      <RoleSelector selectedRole={form.role} onRoleChange={onRoleChange} />
      <FormInput
        label="Full Name"
        name="full_name"
        value={form.full_name}
        onChange={(value) => onFieldChange("full_name", value)}
        placeholder="Your name"
        required
      />
      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        onChange={(value) => onFieldChange("email", value)}
        placeholder="you@example.com"
        required
      />
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(value) => onFieldChange("password", value)}
          placeholder="Create a password"
          required
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(value) => onFieldChange("confirmPassword", value)}
          placeholder="Confirm password"
          required
        />
      </div>
      {form.role === "service_provider" && (
        <ServiceCategorySelect
          value={form.category}
          onChange={(value) => onFieldChange("category", value)}
        />
      )}
    </>
  );
}
