"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PackageDetails from "@/components/packages/PackageDetails";
import { fetchWeddingPackage } from "@/lib/packagesApi";
import type { WeddingPackage } from "@/types/packages";

export default function PackageDetailsPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<WeddingPackage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeddingPackage(params.id).then(setItem).catch((err) => setError(err.message));
  }, [params.id]);

  if (error) return <div className="min-h-screen bg-[#efefef] p-10 text-sm text-red-700">{error}</div>;
  if (!item) return <div className="min-h-screen bg-[#efefef] p-10 text-sm">Loading package...</div>;
  return <div className="min-h-screen bg-[#efefef]"><PackageDetails item={item} /></div>;
}
