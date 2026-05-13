import type { WeddingPlan } from "@/types/weddingPlan";

type Props = {
  plans: WeddingPlan[];
  onDelete: (plan: WeddingPlan) => void;
  onEdit: (plan: WeddingPlan) => void;
};

function money(value?: number | null) {
  return value ? `$${Number(value).toLocaleString()}` : "-";
}

export default function WeddingPlanTable({ plans, onDelete, onEdit }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#111111]/10 text-sm">
          <thead className="bg-event-paper text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Style</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {plans.map((plan) => (
              <tr key={plan.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">
                  {plan.customer_name || `Customer #${plan.customer_id}`}
                </td>
                <td className="px-4 py-4">{plan.wedding_date || "-"}</td>
                <td className="px-4 py-4">{money(plan.budget)}</td>
                <td className="px-4 py-4">{plan.guest_count || "-"}</td>
                <td className="px-4 py-4">{plan.wedding_style || "-"}</td>
                <td className="px-4 py-4">{plan.preferred_services.join(", ") || "-"}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => onEdit(plan)} className="rounded-full border px-3 py-1.5 font-semibold">
                    Edit
                  </button>
                  <button onClick={() => onDelete(plan)}
                    className="ml-2 rounded-full bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!plans.length && <p className="px-4 py-6 text-sm text-stone-500">No wedding plans found.</p>}
    </div>
  );
}
