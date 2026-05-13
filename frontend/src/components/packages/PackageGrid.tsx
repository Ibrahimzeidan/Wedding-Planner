import PackageCard from "@/components/packages/PackageCard";
import type { WeddingPackage } from "@/types/packages";

type Props = { packages: WeddingPackage[] };

export default function PackageGrid({ packages }: Props) {
  if (!packages.length) {
    return <section className="mx-auto max-w-6xl px-4 py-10"><div className="bg-white p-8 text-center text-sm text-stone-600 shadow-soft">No active packages match these filters.</div></section>;
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((item) => <PackageCard key={item.id} item={item} />)}
    </section>
  );
}
