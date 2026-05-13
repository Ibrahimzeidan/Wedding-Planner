"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminPackageForm from "@/components/admin/packages/AdminPackageForm";
import AdminPackageTable from "@/components/admin/packages/AdminPackageTable";
import { getAdminProviders } from "@/lib/adminApi";
import { createAdminPackage, deleteAdminPackage, getAdminPackages, updateAdminPackage } from "@/lib/adminPackagesApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminProvider } from "@/types/admin";
import type { PackagePayload, ProviderPackage } from "@/types/packages";

export default function AdminPackagesManager() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [packages, setPackages] = useState<ProviderPackage[]>([]);
  const [editing, setEditing] = useState<ProviderPackage | null>(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [providerData, packageData] = await Promise.all([getAdminProviders(), getAdminPackages()]);
    setProviders(providerData);
    setPackages(packageData);
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);
  const shown = useMemo(() => packages.filter((item) => (
    !filter || String(item.provider_id) === filter
  ) && matchesAdminSearch(item, search)), [packages, filter, search]);

  async function save(payload: PackagePayload) {
    editing ? await updateAdminPackage(editing.id, payload) : await createAdminPackage(payload);
    setEditing(null);
    setMessage("Package saved.");
    await load();
  }

  async function remove(id: number) {
    await deleteAdminPackage(id);
    setMessage("Package deleted.");
    await load();
  }

  async function toggle(item: ProviderPackage) {
    await updateAdminPackage(item.id, { is_available: !item.is_available });
    await load();
  }

  return (
    <AdminLayout title="Package Control" description="Create, edit, delete, and filter all provider packages.">
      {message && <p className="mb-4 bg-white p-3 text-sm text-stone-700 shadow-soft">{message}</p>}
      <div className="mb-4"><AdminPackageForm providers={providers} initial={editing} onSave={save} onCancel={editing ? () => setEditing(null) : undefined} /></div>
      <div className="mb-4 grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft md:grid-cols-2">
        <AdminSearchBox value={search} onChange={setSearch} placeholder="Search packages by title, category, price, status..." />
        <select className="border bg-white p-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All providers</option>
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.business_name || provider.provider_name}</option>)}
        </select>
      </div>
      <AdminPackageTable packages={shown} onEdit={setEditing} onDelete={remove} onToggle={toggle} />
    </AdminLayout>
  );
}
