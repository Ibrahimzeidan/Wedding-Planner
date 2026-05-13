"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import ProviderEditForm from "@/components/admin/ProviderEditForm";
import ProviderFilter from "@/components/admin/ProviderFilter";
import ProviderTable from "@/components/admin/ProviderTable";
import { deleteAdminProvider, getAdminCategories, getAdminProviders, updateAdminProvider } from "@/lib/adminApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminCategory, AdminProvider, ProviderPayload } from "@/types/admin";

export default function ProviderManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminProvider | null>(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Promise.all([getAdminCategories(), getAdminProviders()])
      .then(([categoryData, providerData]) => {
        setCategories(categoryData);
        setProviders(providerData);
      })
      .catch((error) => setErrorMessage((error as Error).message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => (
      !categoryId || String(provider.category_id) === categoryId
    ) && (!status || providerStatus(provider) === status) && matchesAdminSearch(provider, search));
  }, [categoryId, providers, search, status]);

  async function saveProvider(payload: ProviderPayload) {
    if (!editing) return;
    const updated = await updateAdminProvider(editing.id, payload);
    setProviders((items) => items.map((item) => item.id === updated.id ? updated : item));
    setEditing(null);
  }

  async function patchProvider(provider: AdminProvider, payload: ProviderPayload) {
    const updated = await updateAdminProvider(provider.id, payload);
    setProviders((items) => items.map((item) => item.id === updated.id ? updated : item));
  }

  async function removeProvider(provider: AdminProvider) {
    if (!window.confirm(`Delete ${provider.business_name || provider.provider_name}?`)) return;
    await deleteAdminProvider(provider.id);
    setProviders((items) => items.filter((item) => item.id !== provider.id));
  }

  return (
    <AdminLayout title="View Providers" description="Review provider accounts and their selected service category.">
      {errorMessage && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      )}
      <div className="mb-4 grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-3">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search providers by name, email, business, category, location..." />
        <ProviderFilter categories={categories} value={categoryId} onChange={setCategoryId} />
        <select className="border bg-white p-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option value="approved">Approved</option>
          <option value="pending">Pending</option><option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {editing && <div className="mb-4"><ProviderEditForm provider={editing} categories={categories}
        onSave={saveProvider} onCancel={() => setEditing(null)} /></div>}
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading providers...</p>
      ) : (
        <ProviderTable providers={filteredProviders} onEdit={setEditing}
          onDelete={removeProvider} onPatch={patchProvider} />
      )}
    </AdminLayout>
  );
}

function providerStatus(provider: AdminProvider) {
  if (!provider.is_active) return "inactive";
  return provider.is_approved ? "approved" : "pending";
}
