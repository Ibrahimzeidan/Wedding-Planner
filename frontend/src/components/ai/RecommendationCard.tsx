import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import BookingFlow from "@/components/bookings/BookingFlow";
import MessageProviderButton from "@/components/messages/MessageProviderButton";
import type { AIRecommendationItem } from "@/types/ai";

type Props = {
  item: AIRecommendationItem;
};

function money(value: number) {
  return `$${Number(value).toLocaleString()}`;
}

export default function RecommendationCard({ item }: Props) {
  return (
    <article className="bg-event-paper p-4">
      <p className="text-xs font-semibold uppercase text-stone-500">{item.category}</p>
      <h3 className="mt-1 font-semibold text-[#111111]">{item.package}</h3>
      <p className="text-sm text-stone-700">{item.provider}</p>
      <p className="mt-2 text-sm font-semibold">{money(item.price)}</p>
      <p className="mt-2 text-xs leading-5 text-stone-600">{item.reason}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-600">
        {item.location && <span><MapPin className="mr-1 inline h-3 w-3" />{item.location}</span>}
        {item.capacity && <span><Users className="mr-1 inline h-3 w-3" />{item.capacity}</span>}
        {item.rating && <span><Star className="mr-1 inline h-3 w-3" />{item.rating}</span>}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Link href={`/providers/${item.provider_id}`} className="border px-3 py-2 text-center text-sm font-semibold">
          View
        </Link>
        <MessageProviderButton
          providerId={item.provider_id}
          label="Message"
          className="border px-3 py-2 text-sm font-semibold"
        />
        <BookingFlow
          seed={{
            providerId: item.provider_id,
            providerName: item.provider,
            packageId: item.package_id,
            packageTitle: item.package,
            totalPrice: item.price,
          }}
          label="Book"
          className="bg-[#111111] px-3 py-2 text-sm font-semibold text-white"
        />
      </div>
    </article>
  );
}
