import type { CategoryPayload } from "@/types/admin";

type CategoryFormProps = {
  draft: CategoryPayload;
  isEditing: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onChange: (draft: CategoryPayload) => void;
  onSubmit: () => void;
};

export default function CategoryForm({
  draft,
  isEditing,
  isSaving,
  onCancel,
  onChange,
  onSubmit,
}: CategoryFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="grid gap-4 border border-[#111111]/10 bg-white p-5 shadow-soft"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#111111]">
          Category name
          <input
            value={draft.name}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            className="border-0 border-b border-[#111111]/25 bg-transparent px-0 py-3 outline-none focus:border-[#111111]"
            placeholder="Photographer"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#111111]">
          Description
          <input
            value={draft.description ?? ""}
            onChange={(event) => onChange({ ...draft, description: event.target.value })}
            className="border-0 border-b border-[#111111]/25 bg-transparent px-0 py-3 outline-none focus:border-[#111111]"
            placeholder="Short category description"
          />
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] disabled:bg-stone-300"
        >
          {isSaving ? "Saving..." : isEditing ? "Update category" : "Add category"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#111111]/20 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-[#111111]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
