import { useEffect, useState } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/lib/adminApi";
import type { AdminCategory, CategoryPayload, UiMessage } from "@/types/admin";

const emptyDraft: CategoryPayload = { name: "", description: "" };

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [draft, setDraft] = useState<CategoryPayload>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<UiMessage | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    try {
      setCategories(await getAdminCategories());
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setDraft(emptyDraft); setEditingId(null);
  }

  function editCategory(category: AdminCategory) {
    setDraft({ name: category.name, description: category.description ?? "" });
    setEditingId(category.id);
  }

  async function saveCategory() {
    const name = draft.name.trim();
    const duplicate = categories.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== editingId,
    );

    if (duplicate) {
      setMessage({ type: "error", text: "Category name already exists." });
      return;
    }

    setIsSaving(true);
    try {
      const payload = { name, description: draft.description?.trim() || null };
      editingId ? await updateAdminCategory(editingId, payload) : await createAdminCategory(payload);
      setMessage({ type: "success", text: editingId ? "Category updated." : "Category added." });
      resetForm();
      await loadCategories();
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCategory(category: AdminCategory) {
    if (!window.confirm(`Delete ${category.name}?`)) return;

    try {
      await deleteAdminCategory(category.id);
      setMessage({ type: "success", text: "Category deleted." });
      await loadCategories();
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    }
  }

  return { categories, draft, editingId, editCategory, isLoading, isSaving, message, removeCategory, resetForm, saveCategory, setDraft };
}
