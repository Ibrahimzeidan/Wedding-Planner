import type { UserRole } from "@/lib/auth";

type RoleFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

const roles: { value: UserRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "service_provider", label: "Service provider" },
  { value: "admin", label: "Admin" },
];

export default function RoleFilter({ value, onChange }: RoleFilterProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111] sm:max-w-xs">
      Filter by role
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-[#111111]/15 bg-white px-4 py-3 outline-none focus:border-[#111111]"
      >
        <option value="">All roles</option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </label>
  );
}
