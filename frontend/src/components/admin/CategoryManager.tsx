"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminNotice from "@/components/admin/AdminNotice";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryTable from "@/components/admin/CategoryTable";
import { useAdminCategories } from "@/hooks/useAdminCategories";

export default function CategoryManager() {
  const manager = useAdminCategories();

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
      <div className="mt-6">
        {manager.isLoading ? (
          <p className="text-sm text-stone-600">Loading categories...</p>
        ) : (
          <CategoryTable
            categories={manager.categories}
            onDelete={manager.removeCategory}
            onEdit={manager.editCategory}
          />
        )}
      </div>
    </AdminLayout>
  );
}
