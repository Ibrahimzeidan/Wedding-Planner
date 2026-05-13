import { preferredServiceOptions, weddingStyles } from "@/components/wedding-plan/weddingPlanOptions";
import type { WeddingPlanPayload } from "@/types/weddingPlan";

type Props = {
  draft: WeddingPlanPayload;
  onToggle: (service: string) => void;
  onUpdate: <K extends keyof WeddingPlanPayload>(field: K, value: WeddingPlanPayload[K]) => void;
};

export default function WeddingPlanFields({ draft, onToggle, onUpdate }: Props) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="border p-3" type="date" value={draft.wedding_date ?? ""}
          onChange={(e) => onUpdate("wedding_date", e.target.value)} />
        <input className="border p-3" type="number" min="0" placeholder="Budget"
          value={draft.budget ?? ""} onChange={(e) => onUpdate("budget", e.target.value ? Number(e.target.value) : null)} />
        <input className="border p-3" type="number" min="1" placeholder="Guest Count"
          value={draft.guest_count ?? ""} onChange={(e) => onUpdate("guest_count", e.target.value ? Number(e.target.value) : null)} />
        <input className="border p-3" placeholder="Location" value={draft.location ?? ""}
          onChange={(e) => onUpdate("location", e.target.value)} />
      </div>
      <select className="border p-3" value={draft.wedding_style ?? ""}
        onChange={(e) => onUpdate("wedding_style", e.target.value)}>
        <option value="">Choose wedding style</option>
        {weddingStyles.map((style) => <option key={style}>{style}</option>)}
      </select>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {preferredServiceOptions.map((service) => (
          <label key={service} className="flex items-center gap-2 border border-[#111111]/10 p-3 text-sm">
            <input type="checkbox" checked={draft.preferred_services.includes(service)}
              onChange={() => onToggle(service)} />
            {service}
          </label>
        ))}
      </div>
    </>
  );
}
