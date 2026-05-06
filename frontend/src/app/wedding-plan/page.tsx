import { Sparkles } from "lucide-react";
import EmptyStatePage from "@/components/shared/EmptyStatePage";

export default function WeddingPlanPage() {
  return (
    <EmptyStatePage
      eyebrow="Wedding plan"
      title="Create your wedding plan"
      description="Create your wedding plan and let AI recommend services."
      emptyTitle="No wedding plan yet"
      emptyDescription="Start with your date, budget, style, and must-have services. AI recommendations will come next."
      actionLabel="Create Wedding Plan"
      actionHref="/dashboard/customer"
      icon={Sparkles}
    />
  );
}
