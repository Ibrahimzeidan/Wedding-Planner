"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import RoleFilter from "@/components/admin/RoleFilter";
import UserForm from "@/components/admin/UserForm";
import UserTable from "@/components/admin/UserTable";
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from "@/lib/adminApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminUser, UserPayload } from "@/types/admin";

const emptyDraft: UserPayload = { full_name: "", email: "", password: "", role: "customer", is_active: true };

export default function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [draft, setDraft] = useState<UserPayload>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => { loadUsers(); }, []);
  function loadUsers() {
    setIsLoading(true);
    getAdminUsers().then(setUsers).catch(showError).finally(() => setIsLoading(false));
  }
  const filteredUsers = useMemo(() => {
    return users.filter((user) => (!role || user.role === role) && matchesAdminSearch(user, search));
  }, [role, search, users]);
  async function saveUser() {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const saved = editingId ? await updateAdminUser(editingId, draft) : await createAdminUser(draft);
      setUsers((current) => (editingId ? updateCurrentUser(current, saved) : [saved, ...current]));
      setSuccessMessage(editingId ? "User updated successfully." : "User created successfully.");
      resetForm();
    } catch (error) {
      showError(error);
    } finally {
      setIsSaving(false);
    }
  }
  async function removeUser(user: AdminUser) {
    if (!window.confirm(`Delete ${user.full_name}?`)) return;
    try {
      await deleteAdminUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setSuccessMessage("User deleted successfully.");
    } catch (error) {
      showError(error);
    }
  }
  function editUser(user: AdminUser) {
    setEditingId(user.id);
    setDraft({ ...user, password: "" });
  }
  function resetForm() {
    setEditingId(null);
    setDraft(emptyDraft);
  }
  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "Action failed.");
  }
  return (
    <AdminLayout title="View Users" description="Browse platform users and filter by account role.">
      {successMessage && <AdminNotice message={{ type: "success", text: successMessage }} />}
      {errorMessage && <AdminNotice message={{ type: "error", text: errorMessage }} />}
      <UserForm draft={draft} isEditing={editingId !== null} isSaving={isSaving} onCancel={resetForm} onChange={setDraft} onSubmit={saveUser} />
      <div className="mb-4 grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-2">
        <AdminSearchBox value={search} onChange={setSearch} />
        <RoleFilter value={role} onChange={setRole} />
      </div>
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading users...</p>
      ) : (
        <UserTable users={filteredUsers} onDelete={removeUser} onEdit={editUser} />
      )}
    </AdminLayout>
  );
}
function updateCurrentUser(users: AdminUser[], saved: AdminUser) {
  return users.map((user) => (user.id === saved.id ? saved : user));
}
