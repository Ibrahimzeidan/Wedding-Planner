import type { AdminCustomer } from "@/types/admin";

type Props = {
  customers: AdminCustomer[];
  onDelete: (customer: AdminCustomer) => void;
  onEdit: (customer: AdminCustomer) => void;
  onToggle: (customer: AdminCustomer) => void;
};

export default function CustomerTable({ customers, onDelete, onEdit, onToggle }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-event-paper text-xs uppercase text-stone-500">
            <tr>{["Customer", "Contact", "Plan", "Bookings", "Favorites", "Status", "Actions"]
              .map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {customers.map((customer) => (
              <tr key={customer.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{customer.full_name}</td>
                <td className="px-4 py-4">{customer.email}<br />{customer.phone || "-"}</td>
                <td className="px-4 py-4">{customer.wedding_plan_count}</td>
                <td className="px-4 py-4">{customer.booking_count}</td>
                <td className="px-4 py-4">{customer.favorite_count}</td>
                <td className="px-4 py-4">{customer.is_active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => onEdit(customer)} className="border px-3 py-1 font-semibold">Edit</button>
                    <button onClick={() => onToggle(customer)} className="border px-3 py-1 font-semibold">
                      {customer.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => onDelete(customer)}
                      className="bg-[#111111] px-3 py-1 font-semibold text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!customers.length && <p className="px-4 py-6 text-sm text-stone-500">No customers found.</p>}
    </div>
  );
}
