import type { AdminProvider } from "@/types/admin";

export default function ProviderTable({ providers }: { providers: AdminProvider[] }) {
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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {providers.map((provider) => (
              <tr key={provider.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{provider.provider_name}</td>
                <td className="px-4 py-4">{provider.email}</td>
                <td className="px-4 py-4">{provider.category_name}</td>
                <td className="px-4 py-4">{provider.business_name || "Not added"}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-event-paper px-3 py-1 text-xs font-semibold text-[#111111]">
                    {provider.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-4">{new Date(provider.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!providers.length && <p className="px-4 py-6 text-sm text-stone-500">No providers found.</p>}
    </div>
  );
}
