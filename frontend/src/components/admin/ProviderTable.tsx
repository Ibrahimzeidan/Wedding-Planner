import type { AdminProvider, ProviderPayload } from "@/types/admin";

type Props = {
  providers: AdminProvider[];
  onEdit: (provider: AdminProvider) => void;
  onDelete: (provider: AdminProvider) => void;
  onPatch: (provider: AdminProvider, patch: ProviderPayload) => void;
};

export default function ProviderTable({ providers, onEdit, onDelete, onPatch }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#111111]/10 text-sm">
          <thead className="bg-event-paper text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {providers.map((provider) => (
              <tr key={provider.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{provider.provider_name}</td>
                <td className="px-4 py-4">{provider.email}</td>
                <td className="px-4 py-4">{provider.category_name}</td>
                <td className="px-4 py-4">{provider.business_name || "Not added"}</td>
                <td className="px-4 py-4">{provider.is_active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-event-paper px-3 py-1 text-xs font-semibold text-[#111111]">
                    {provider.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-4">{new Date(provider.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => onPatch(provider, { is_approved: !provider.is_approved })}
                    className="border px-3 py-1 font-semibold">{provider.is_approved ? "Reject" : "Approve"}</button>
                  <button onClick={() => onPatch(provider, { is_active: !provider.is_active })}
                    className="ml-2 border px-3 py-1 font-semibold">{provider.is_active ? "Deactivate" : "Activate"}</button>
                  <button onClick={() => onEdit(provider)} className="ml-2 border px-3 py-1 font-semibold">Edit</button>
                  <button onClick={() => onDelete(provider)}
                    className="ml-2 bg-[#111111] px-3 py-1 font-semibold text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!providers.length && <p className="px-4 py-6 text-sm text-stone-500">No providers found.</p>}
    </div>
  );
}
