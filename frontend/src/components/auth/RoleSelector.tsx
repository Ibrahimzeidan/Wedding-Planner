import type { UserRole } from "@/lib/auth";

export type RegisterRole = Extract<UserRole, "customer" | "service_provider">;

type RoleOption = {
  value: RegisterRole;
  label: string;
  helpText: string;
};

type RoleSelectorProps = {
  selectedRole: RegisterRole;
  onRoleChange: (role: RegisterRole) => void;
};

const roleOptions: RoleOption[] = [
  {
    value: "customer",
    label: "Customer",
    helpText: "Plan your wedding and find trusted services.",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    helpText: "List your wedding service for couples.",
  },
];

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roleOptions.map((option) => {
        const isSelected = selectedRole === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onRoleChange(option.value)}
            className={`min-h-20 border px-4 py-3 text-left transition ${
              isSelected
                ? "border-[#111111] bg-[#111111] text-white shadow-soft"
                : "border-[#111111]/15 bg-white text-stone-700 hover:border-[#111111]"
            }`}
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            <span className={`mt-2 block text-sm leading-6 ${isSelected ? "text-white/70" : "text-stone-500"}`}>
              {option.helpText}
            </span>
          </button>
        );
      })}
    </div>
  );
}
