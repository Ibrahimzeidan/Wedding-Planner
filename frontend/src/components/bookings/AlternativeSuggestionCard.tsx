import BookingFlow from "@/components/bookings/BookingFlow";
import type { AIReplacementData } from "@/types/ai";

type Props = {
  item: AIReplacementData;
};

export default function AlternativeSuggestionCard({ item }: Props) {
  return (
    <article className="mt-4 rounded-md border border-[#111111]/10 bg-event-paper p-4">
      <p className="text-xs font-semibold uppercase text-stone-500">{item.category}</p>
      <h3 className="mt-1 font-semibold text-[#111111]">{item.provider}</h3>
      <p className="text-sm text-stone-700">{item.package}</p>
      <p className="mt-2 text-sm font-semibold">${Number(item.price).toLocaleString()}</p>
      <p className="mt-2 text-xs leading-5 text-stone-600">{item.reason}</p>
      <BookingFlow
        seed={{
          providerId: item.provider_id,
          providerName: item.provider,
          packageId: item.package_id,
          packageTitle: item.package,
          totalPrice: item.price,
        }}
        label="Book This Alternative"
        className="mt-3 rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
      />
    </article>
  );
}
