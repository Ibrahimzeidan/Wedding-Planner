import FormField from "@/components/account/FormField";
import SettingsCard from "@/components/account/SettingsCard";

type AvailabilityFormProps = {
  draft: Record<string, string>;
  onDraft: (draft: Record<string, string>) => void;
  onSave: () => void;
};

export default function AvailabilityForm({ draft, onDraft, onSave }: AvailabilityFormProps) {
  return (
    <SettingsCard title="Availability">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Available Days" value={draft.available_days}
          onChange={(available_days) => onDraft({ ...draft, available_days })} />
        <FormField label="Start Time" type="time" value={draft.start_time}
          onChange={(start_time) => onDraft({ ...draft, start_time })} />
        <FormField label="End Time" type="time" value={draft.end_time}
          onChange={(end_time) => onDraft({ ...draft, end_time })} />
      </div>
      <button onClick={onSave} className="mt-6 rounded-lg bg-[#111111] px-6 py-3 text-sm font-semibold text-white">
        Save Availability
      </button>
    </SettingsCard>
  );
}
