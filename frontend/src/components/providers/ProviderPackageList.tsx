import type { ServicePackage } from "@/types/services";
import BookingFlow from "@/components/bookings/BookingFlow";

type Props = { packages: ServicePackage[] };

export default function ProviderPackageList({ packages }: Props) {
  if (!packages.length) return <div className="bg-white p-6 text-sm text-stone-600 shadow-soft">No packages are currently available.</div>;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-[#111111]">Provider Packages</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <article key={item.id} className="bg-white p-5 shadow-soft">
            <h3 className="font-semibold text-[#111111]">{item.title}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">{item.description}</p>
            <p className="mt-3 text-lg font-semibold">${Number(item.price ?? 0).toLocaleString()}</p>
            <p className="text-xs text-stone-500">{item.capacity ? `${item.capacity} guests` : ""} {item.duration || ""}</p>
            <BookingFlow
              seed={{
                providerId: item.provider_id,
                providerName: item.provider_name,
                packageId: item.id,
                packageTitle: item.title,
                totalPrice: item.price || 0,
              }}
              label="Request Booking"
              className="mt-4 w-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
