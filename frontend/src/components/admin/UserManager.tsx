"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleFilter from "@/components/admin/RoleFilter";
import UserTable from "@/components/admin/UserTable";
import { getAdminUsers } from "@/lib/adminApi";
import type { AdminUser } from "@/types/admin";

export default function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    if (!role) return users;
    return users.filter((user) => user.role === role);
  }, [role, users]);

  return (
    <AdminLayout title="View Users" description="Browse platform users and filter by account role.">
      {errorMessage && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <RoleFilter value={role} onChange={setRole} />
      </div>
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading users...</p>
      ) : (
        <UserTable users={filteredUsers} />
      )}
    </AdminLayout>
  );
}
