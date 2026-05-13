import type { AdminAIRecommendation } from "@/types/admin";

export default function AIRecommendationDetails({ item }: { item: AdminAIRecommendation | null }) {
  if (!item) {
    return <div className="border border-[#111111]/10 bg-white p-5 text-sm text-stone-600 shadow-soft">
      Select a recommendation to view its generated items.
    </div>;
  }

  return (
    <section className="border border-[#111111]/10 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-[#111111]">Recommendation #{item.id}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{item.recommendation_summary || "No summary saved."}</p>
      <div className="mt-4 grid gap-3">
        {item.items.map((row) => (
          <article key={row.id} className="border border-[#111111]/10 p-4">
            <div className="flex flex-wrap justify-between gap-3 text-sm">
              <strong>{row.category_name}</strong>
              <span>${Number(row.item_price).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              {row.provider_name || "Provider"} - {row.package_title || "Package"}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{row.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
