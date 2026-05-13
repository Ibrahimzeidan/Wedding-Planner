import VenueCard from "@/components/venues/VenueCard";
import type { ServiceProvider } from "@/types/services";

type VenueGridProps = {
  venues: ServiceProvider[];
};

export default function VenueGrid({ venues }: VenueGridProps) {
  if (!venues.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
          No venues match these filters yet.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-950">Wedding Venues</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
      </div>
    </section>
  );
}
