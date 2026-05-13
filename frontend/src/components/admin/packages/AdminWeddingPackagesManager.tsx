"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminWeddingPackageForm from "@/components/admin/packages/AdminWeddingPackageForm";
import AdminWeddingPackageTable from "@/components/admin/packages/AdminWeddingPackageTable";
import WeddingPackageItems from "@/components/admin/packages/WeddingPackageItems";
import { getAdminProviders } from "@/lib/adminApi";
import { addWeddingPackageItem, createWeddingPackage, deleteWeddingPackage } from "@/lib/adminPackagesApi";
import { deleteWeddingPackageItem, getAdminWeddingPackages, updateWeddingPackage } from "@/lib/adminPackagesApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminProvider } from "@/types/admin";
import type { WeddingItemPayload, WeddingPackage, WeddingPackagePayload } from "@/types/packages";

export default function AdminWeddingPackagesManager() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [packages, setPackages] = useState<WeddingPackage[]>([]);
  const [editing, setEditing] = useState<WeddingPackage | null>(null);
  const [selected, setSelected] = useState<WeddingPackage | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    const [providerData, packageData] = await Promise.all([getAdminProviders(), getAdminWeddingPackages()]);
    setProviders(providerData);
    setPackages(packageData);
    if (selected) setSelected(packageData.find((item) => item.id === selected.id) ?? null);
  }

  useEffect(() => { load(); }, []);
  const shown = useMemo(
    () => packages.filter((item) => matchesAdminSearch(item, search)),
    [packages, search],
  );
  async function save(payload: WeddingPackagePayload) {
    editing ? await updateWeddingPackage(editing.id, payload) : await createWeddingPackage(payload);
    setEditing(null);
    await load();
  }
  async function addItem(payload: WeddingItemPayload) {
    if (selected) setSelected(await addWeddingPackageItem(selected.id, payload));
    await load();
  }
  async function removeItem(itemId: number) {
    if (selected) setSelected(await deleteWeddingPackageItem(selected.id, itemId));
    await load();
  }

  return (
    <AdminLayout title="Wedding Packages" description="Control the public ready-made wedding packages and included providers.">
      <div className="mb-4"><AdminWeddingPackageForm initial={editing} onSave={save} onCancel={editing ? () => setEditing(null) : undefined} /></div>
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch} placeholder="Search wedding packages by title, provider, price, capacity..." />
      </div>
      <AdminWeddingPackageTable packages={shown} selectedId={selected?.id} onSelect={setSelected} onEdit={setEditing} onDelete={async (id) => { await deleteWeddingPackage(id); await load(); }} onToggle={async (item) => { await updateWeddingPackage(item.id, { is_active: !item.is_active }); await load(); }} />
      <div className="mt-4"><WeddingPackageItems item={selected} providers={providers} onAdd={addItem} onDelete={removeItem} /></div>
    </AdminLayout>
  );
}
