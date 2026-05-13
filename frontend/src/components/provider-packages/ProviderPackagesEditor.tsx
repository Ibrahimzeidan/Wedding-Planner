"use client";

import { useEffect, useState } from "react";
import ProviderPackageForm from "@/components/provider-packages/ProviderPackageForm";
import ProviderPackageTable from "@/components/provider-packages/ProviderPackageTable";
import { createProviderPackage, deleteProviderPackage, getProviderPackages } from "@/lib/providerPackagesApi";
import { updateProviderPackage } from "@/lib/providerPackagesApi";
import type { PackagePayload, ProviderPackage } from "@/types/packages";

type Props = {
  compact?: boolean;
};

export default function ProviderPackagesEditor({ compact = false }: Props) {
  const [packages, setPackages] = useState<ProviderPackage[]>([]);
  const [editing, setEditing] = useState<ProviderPackage | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setPackages(await getProviderPackages());
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  async function save(payload: PackagePayload) {
    editing ? await updateProviderPackage(editing.id, payload) : await createProviderPackage(payload);
    setEditing(null);
    setMessage("Package saved.");
    await load();
  }

  async function remove(id: number) {
    await deleteProviderPackage(id);
    setMessage("Package deleted.");
    await load();
  }

  async function toggle(item: ProviderPackage) {
    await updateProviderPackage(item.id, { is_available: !item.is_available });
    await load();
  }

  return (
    <div className={compact ? "rounded-2xl bg-white p-5 shadow-soft" : ""}>
      <h2 className="text-xl font-semibold text-[#111111]">My Packages</h2>
      <p className="mt-2 text-sm text-stone-600">View, create, edit, delete, and toggle your service packages.</p>
      {message && <p className="my-4 bg-stone-50 p-3 text-sm text-stone-700">{message}</p>}
      <div className="my-6">
        <ProviderPackageForm initial={editing} onSave={save} onCancel={editing ? () => setEditing(null) : undefined} />
      </div>
      <ProviderPackageTable packages={packages} onEdit={setEditing} onDelete={remove} onToggle={toggle} />
    </div>
  );
}
