"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryTable from "@/components/admin/CategoryTable";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { matchesAdminSearch } from "@/lib/adminSearch";

export default function CategoryManager() {
  const manager = useAdminCategories();
  const [search, setSearch] = useState("");
  const shown = useMemo(
    () => manager.categories.filter((category) => matchesAdminSearch(category, search)),
    [manager.categories, search],
  );

  return (
    <AdminLayout title="Manage Categories" description="Add, edit, and remove wedding service categories.">
      {manager.message && <AdminNotice message={manager.message} />}
      <CategoryForm
        draft={manager.draft}
        isEditing={manager.editingId !== null}
        isSaving={manager.isSaving}
        onCancel={manager.resetForm}
        onChange={manager.setDraft}
        onSubmit={manager.saveCategory}
      />
      <div className="mt-6 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch} placeholder="Search categories by name or description..." />
      </div>
      <div className="mt-6">
        {manager.isLoading ? (
          <p className="text-sm text-stone-600">Loading categories...</p>
        ) : (
          <CategoryTable
            categories={shown}
            onDelete={manager.removeCategory}
            onEdit={manager.editCategory}
          />
        )}
      </div>
    </AdminLayout>
  );
}
