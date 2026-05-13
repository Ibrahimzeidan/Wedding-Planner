"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProviderDetailsHeader from "@/components/providers/ProviderDetailsHeader";
import ProviderPackageList from "@/components/providers/ProviderPackageList";
import ProviderReviewSection from "@/components/reviews/ProviderReviewSection";
import { fetchProviderDetails } from "@/lib/packagesApi";
import type { ProviderDetails } from "@/types/packages";

export default function ProviderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProviderDetails(params.id).then(setProvider).catch((err) => setError(err.message));
  }, [params.id]);

  if (error) return <div className="min-h-screen bg-[#efefef] p-10 text-sm text-red-700">{error}</div>;
  if (!provider) return <div className="min-h-screen bg-[#efefef] p-10 text-sm">Loading provider...</div>;

  return (
    <main className="min-h-screen bg-[#efefef]">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/services" className="mb-5 inline-block text-sm font-semibold text-stone-700">Back</Link>
        <ProviderDetailsHeader provider={provider} />
        <ProviderPackageList packages={provider.packages} />
        <ProviderReviewSection providerId={provider.id} />
      </section>
    </main>
  );
}
