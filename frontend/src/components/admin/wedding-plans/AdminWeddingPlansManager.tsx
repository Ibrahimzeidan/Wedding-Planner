"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import WeddingPlanTable from "@/components/admin/wedding-plans/WeddingPlanTable";
import WeddingPlanForm from "@/components/wedding-plan/WeddingPlanForm";
import { deleteAdminWeddingPlan, getAdminWeddingPlans, updateAdminWeddingPlan } from "@/lib/weddingPlanApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { WeddingPlan, WeddingPlanPayload } from "@/types/weddingPlan";

export default function AdminWeddingPlansManager() {
  const [plans, setPlans] = useState<WeddingPlan[]>([]);
  const [editing, setEditing] = useState<WeddingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setPlans(await getAdminWeddingPlans());
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message)).finally(() => setIsLoading(false));
  }, []);
  const shown = useMemo(() => plans.filter((plan) => matchesAdminSearch(plan, search)), [plans, search]);

  async function save(payload: WeddingPlanPayload) {
    if (!editing) return;
    try {
      const updated = await updateAdminWeddingPlan(editing.id, payload);
      setPlans((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditing(null);
      setMessage("Wedding plan updated.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function remove(plan: WeddingPlan) {
    if (!window.confirm(`Delete wedding plan for ${plan.customer_name || "this customer"}?`)) return;
    try {
      await deleteAdminWeddingPlan(plan.id);
      setPlans((items) => items.filter((item) => item.id !== plan.id));
      setMessage("Wedding plan deleted.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <AdminLayout title="Wedding Plans" description="View, edit, and delete customer wedding plans.">
      {message && <p className="mb-4 bg-white p-3 text-sm text-stone-700 shadow-soft">{message}</p>}
      {editing && (
        <div className="mb-4">
          <WeddingPlanForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />
        </div>
      )}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search by customer, email, date, budget, location, style, services..." />
      </div>
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading wedding plans...</p>
      ) : (
        <WeddingPlanTable plans={shown} onDelete={remove} onEdit={setEditing} />
      )}
    </AdminLayout>
  );
}
