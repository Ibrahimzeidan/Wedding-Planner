import ProviderCard from "@/components/services/ProviderCard";
import type { ServiceProvider } from "@/types/services";

type ServiceSectionProps = {
  title: string;
  providers: ServiceProvider[];
  onViewAll: () => void;
};

export default function ServiceSection({ title, providers, onViewAll }: ServiceSectionProps) {
  if (!providers.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
        <button type="button" onClick={onViewAll} className="text-sm font-medium text-stone-700 hover:text-black">
          View All
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} href={`/providers/${provider.id}`} />
        ))}
      </div>
    </section>
  );
}
