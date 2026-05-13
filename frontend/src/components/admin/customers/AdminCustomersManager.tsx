"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import CustomerForm from "@/components/admin/customers/CustomerForm";
import CustomerTable from "@/components/admin/customers/CustomerTable";
import { deleteAdminCustomer, getAdminCustomers, updateAdminCustomer } from "@/lib/adminControlApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminCustomer, CustomerPayload, UiMessage } from "@/types/admin";

export default function AdminCustomersManager() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [editing, setEditing] = useState<AdminCustomer | null>(null);
  const [draft, setDraft] = useState<CustomerPayload>({});
  const [message, setMessage] = useState<UiMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setCustomers(await getAdminCustomers());
  }

  useEffect(() => { load().catch(showError).finally(() => setIsLoading(false)); }, []);
  const shown = useMemo(() => customers.filter((item) => matchesAdminSearch(item, search)), [customers, search]);

  function edit(customer: AdminCustomer) {
    setEditing(customer);
    setDraft({ ...customer });
  }

  async function save() {
    if (!editing) return;
    setIsSaving(true);
    try {
      await updateAdminCustomer(editing.id, draft);
      setMessage({ type: "success", text: "Customer updated successfully." });
      setEditing(null);
      await load();
    } catch (error) { showError(error); } finally { setIsSaving(false); }
  }

  async function toggle(customer: AdminCustomer) {
    await updateAdminCustomer(customer.id, { is_active: !customer.is_active });
    await load();
  }

  async function remove(customer: AdminCustomer) {
    if (!window.confirm(`Delete ${customer.full_name}?`)) return;
    await deleteAdminCustomer(customer.id);
    setMessage({ type: "success", text: "Customer deleted successfully." });
    await load();
  }

  function showError(error: unknown) {
    setMessage({ type: "error", text: error instanceof Error ? error.message : "Action failed." });
  }

  return (
    <AdminLayout title="Customers" description="View, edit, activate, deactivate, and delete customer profiles.">
      {message && <AdminNotice message={message} />}
      {editing && <div className="mb-4"><CustomerForm draft={draft} isSaving={isSaving}
        onCancel={() => setEditing(null)} onChange={setDraft} onSubmit={save} /></div>}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search customers by name, email, phone, location, status..." />
      </div>
      {isLoading ? <p className="text-sm text-stone-600">Loading customers...</p> :
        <CustomerTable customers={shown} onDelete={remove} onEdit={edit} onToggle={toggle} />}
    </AdminLayout>
  );
}
