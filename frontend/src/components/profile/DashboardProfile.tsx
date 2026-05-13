"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import QuickActionGrid from "@/components/profile/QuickActionGrid";
import { getMyAccount } from "@/lib/accountApi";
import type { UserRole } from "@/lib/auth";
import type { AccountData } from "@/types/account";

type DashboardProfileProps = {
  role: UserRole;
};

export default function DashboardProfile({ role }: DashboardProfileProps) {
  return (
    <ProtectedRoute allowedRole={role}>
      {() => <ProfileBody role={role} />}
    </ProtectedRoute>
  );
}

function ProfileBody({ role }: DashboardProfileProps) {
  const [account, setAccount] = useState<AccountData | null>(null);
  useEffect(() => { getMyAccount().then((res) => setAccount(res.data)); }, []);
  if (!account) return <div className="p-10 text-center">Loading profile...</div>;
  return (
    <main className="bg-[#f4f4f4] p-2 pt-24 lg:p-6 lg:pt-24">
      <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
        <ProfileSidebar role={role} />
        <section>
          <h1 className="mb-1 text-2xl font-bold">{role === "customer" ? "My Profile" : "My Business Profile"}</h1>
          <p className="mb-5 text-sm text-stone-500">Dashboard / My Profile</p>
          <ProfileSummaryCard account={account} />
          <QuickActionGrid role={role} />
        </section>
      </div>
    </main>
  );
}
