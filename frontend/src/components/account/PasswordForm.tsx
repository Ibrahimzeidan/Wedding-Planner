"use client";

import { useState } from "react";
import FormField from "@/components/account/FormField";
import SettingsCard from "@/components/account/SettingsCard";
import { updateMyPassword } from "@/lib/accountApi";

export default function PasswordForm({ onMessage }: { onMessage: (message: string) => void }) {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });

  async function submit() {
    if (form.new_password !== form.confirm) {
      onMessage("New passwords do not match.");
      return;
    }
    const response = await updateMyPassword(form);
    onMessage(response.message);
    setForm({ current_password: "", new_password: "", confirm: "" });
  }

  return (
    <SettingsCard title="Change Password">
      <div className="grid gap-4">
        <FormField label="Current Password" type="password" value={form.current_password}
          onChange={(current_password) => setForm({ ...form, current_password })} />
        <FormField label="New Password" type="password" value={form.new_password}
          onChange={(new_password) => setForm({ ...form, new_password })} />
        <FormField label="Confirm New Password" type="password" value={form.confirm}
          onChange={(confirm) => setForm({ ...form, confirm })} />
      </div>
      <button onClick={submit} className="mt-6 rounded-lg bg-[#111111] px-6 py-3 text-sm font-semibold text-white">
        Update Password
      </button>
    </SettingsCard>
  );
}
