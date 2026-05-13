"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AIRecommendationDetails from "@/components/admin/ai/AIRecommendationDetails";
import AIRecommendationsTable from "@/components/admin/ai/AIRecommendationsTable";
import { deleteAdminAIRecommendation, getAdminAIRecommendations } from "@/lib/adminControlApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { AdminAIRecommendation, UiMessage } from "@/types/admin";

export default function AdminAIRecommendationsManager() {
  const [items, setItems] = useState<AdminAIRecommendation[]>([]);
  const [selected, setSelected] = useState<AdminAIRecommendation | null>(null);
  const [message, setMessage] = useState<UiMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    const data = await getAdminAIRecommendations();
    setItems(data);
    setSelected((current) => data.find((item) => item.id === current?.id) ?? data[0] ?? null);
  }

  useEffect(() => { load().catch(showError).finally(() => setIsLoading(false)); }, []);
  const shown = useMemo(() => items.filter((item) => matchesAdminSearch(item, search)), [items, search]);

  async function remove(item: AdminAIRecommendation) {
    if (!window.confirm(`Delete AI recommendation #${item.id}?`)) return;
    await deleteAdminAIRecommendation(item.id);
    setMessage({ type: "success", text: "AI recommendation deleted successfully." });
    await load();
  }

  function showError(error: unknown) {
    setMessage({ type: "error", text: error instanceof Error ? error.message : "Action failed." });
  }

  return (
    <AdminLayout title="AI Recommendations" description="View generated AI planner history and remove stale recommendations.">
      {message && <AdminNotice message={message} />}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search by customer, summary, provider, package, price, date..." />
      </div>
      {isLoading ? <p className="text-sm text-stone-600">Loading AI recommendations...</p> :
        <AIRecommendationsTable items={shown} selectedId={selected?.id} onDelete={remove} onSelect={setSelected} />}
      <div className="mt-4"><AIRecommendationDetails item={selected} /></div>
    </AdminLayout>
  );
}
