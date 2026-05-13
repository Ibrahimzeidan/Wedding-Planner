import { Suspense } from "react";
import ServicesPageContent from "@/components/services/ServicesPageContent";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="bg-[#efefef] p-10 text-sm">Loading services...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
