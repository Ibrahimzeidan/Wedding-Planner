"use client";

import AccountSettings from "@/components/account/AccountSettings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      {() => <AccountSettings />}
    </ProtectedRoute>
  );
}
