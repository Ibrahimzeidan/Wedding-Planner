import type { AdminCategory } from "@/types/admin";

type CategoryTableProps = {
  categories: AdminCategory[];
  onDelete: (category: AdminCategory) => void;
  onEdit: (category: AdminCategory) => void;
};

export default function CategoryTable({ categories, onDelete, onEdit }: CategoryTableProps) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#111111]/10 text-sm">
          <thead className="bg-event-paper text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {categories.map((category) => (
              <tr key={category.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{category.name}</td>
                <td className="px-4 py-4">{category.description || "No description"}</td>
                <td className="px-4 py-4">{new Date(category.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-full border border-[#111111]/20 px-3 py-1.5 font-semibold hover:border-[#111111]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="rounded-full bg-red-50 px-3 py-1.5 font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!categories.length && <p className="px-4 py-6 text-sm text-stone-500">No categories found.</p>}
    </div>
  );
}
