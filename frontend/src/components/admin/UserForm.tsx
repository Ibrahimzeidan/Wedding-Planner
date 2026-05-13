"use client";

import type { UserRole } from "@/lib/auth";
import type { UserPayload } from "@/types/admin";

type UserFormProps = {
  draft: UserPayload;
  isEditing: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onChange: (draft: UserPayload) => void;
  onSubmit: () => void;
};

const roles: { value: UserRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "service_provider", label: "Service provider" },
];

export default function UserForm(props: UserFormProps) {
  const { draft, isEditing, isSaving, onCancel, onChange, onSubmit } = props;
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
      className="grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Full name" value={draft.full_name}
          onChange={(full_name) => onChange({ ...draft, full_name })} />
        <TextField label="Email" value={draft.email}
          onChange={(email) => onChange({ ...draft, email })} />
        {!isEditing && <TextField label="Password" type="password" value={draft.password ?? ""}
          onChange={(password) => onChange({ ...draft, password })} />}
        <label className="grid gap-2 text-sm font-semibold text-[#111111]">
          Role
          <select value={draft.role}
            onChange={(event) => onChange({ ...draft, role: event.target.value as UserRole })}
            className="border-b border-[#111111]/25 bg-transparent py-3 outline-none">
            {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            {isEditing && <option value="admin">Admin</option>}
          </select>
        </label>
        {draft.role === "service_provider" && !isEditing && (
          <TextField label="Category ID" value={String(draft.category_id ?? "")}
            onChange={(value) => onChange({ ...draft, category_id: Number(value) || null })} />
        )}
        {isEditing && <label className="flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" checked={draft.is_active !== false}
            onChange={(event) => onChange({ ...draft, is_active: event.target.checked })} />
          Active account
        </label>}
      </div>
      <div className="flex gap-3">
        <button className="rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white" disabled={isSaving}>
          {isSaving ? "Saving..." : isEditing ? "Update user" : "Create user"}
        </button>
        {isEditing && <button type="button" onClick={onCancel}
          className="rounded-full border px-6 py-3 text-sm font-semibold">Cancel</button>}
      </div>
    </form>
  );
}

function TextField({ label, value, onChange, type = "text" }: {
  label: string; value: string; type?: string; onChange: (value: string) => void;
}) {
  return <label className="grid gap-2 text-sm font-semibold text-[#111111]">{label}
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)}
      className="border-0 border-b border-[#111111]/25 bg-transparent px-0 py-3 outline-none focus:border-[#111111]" required />
  </label>;
}
