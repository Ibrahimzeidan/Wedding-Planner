"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProviderFilter from "@/components/admin/ProviderFilter";
import ProviderTable from "@/components/admin/ProviderTable";
import { getAdminCategories, getAdminProviders } from "@/lib/adminApi";
import type { AdminCategory, AdminProvider } from "@/types/admin";

export default function ProviderManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryData, providerData] = await Promise.all([
          getAdminCategories(),
          getAdminProviders(),
        ]);
        setCategories(categoryData);
        setProviders(providerData);
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProviders = useMemo(() => {
    if (!categoryId) return providers;
    return providers.filter((provider) => String(provider.category_id) === categoryId);
  }, [categoryId, providers]);

  return (
    <AdminLayout title="View Providers" description="Review provider accounts and their selected service category.">
      {errorMessage && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <ProviderFilter categories={categories} value={categoryId} onChange={setCategoryId} />
      </div>
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading providers...</p>
      ) : (
        <ProviderTable providers={filteredProviders} />
      )}
    </AdminLayout>
  );
}
