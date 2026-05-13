import type { AdminAIRecommendation } from "@/types/admin";

type Props = {
  items: AdminAIRecommendation[];
  selectedId?: number;
  onDelete: (item: AdminAIRecommendation) => void;
  onSelect: (item: AdminAIRecommendation) => void;
};

export default function AIRecommendationsTable({ items, selectedId, onDelete, onSelect }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-event-paper text-xs uppercase text-stone-500">
            <tr>{["Customer", "Wedding Plan", "Cost", "Remaining", "Items", "Created", "Actions"]
              .map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {items.map((item) => (
              <tr key={item.id} className={selectedId === item.id ? "bg-stone-50" : "text-stone-700"}>
                <td className="px-4 py-4 font-semibold text-[#111111]">{item.customer_name || item.customer_id}</td>
                <td className="px-4 py-4">#{item.wedding_plan_id}</td>
                <td className="px-4 py-4">${Number(item.total_estimated_cost).toLocaleString()}</td>
                <td className="px-4 py-4">${Number(item.remaining_budget ?? 0).toLocaleString()}</td>
                <td className="px-4 py-4">{item.items.length}</td>
                <td className="px-4 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onSelect(item)} className="border px-3 py-1 font-semibold">Details</button>
                    <button onClick={() => onDelete(item)}
                      className="bg-[#111111] px-3 py-1 font-semibold text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!items.length && <p className="px-4 py-6 text-sm text-stone-500">No AI recommendations found.</p>}
    </div>
  );
}
