import FormField from "@/components/account/FormField";
import SettingsCard from "@/components/account/SettingsCard";

type WeddingPreferencesFormProps = {
  draft: Record<string, string>;
  onDraft: (draft: Record<string, string>) => void;
  onSave: () => void;
};

const styles = ["Classic Wedding", "Luxury Wedding", "Beach Wedding", "Outdoor Wedding"];

export default function WeddingPreferencesForm({ draft, onDraft, onSave }: WeddingPreferencesFormProps) {
  return (
    <SettingsCard title="Wedding Preferences">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Wedding Date" type="date" value={draft.wedding_date}
          onChange={(wedding_date) => onDraft({ ...draft, wedding_date })} />
        <FormField label="Wedding Budget" value={draft.budget}
          onChange={(budget) => onDraft({ ...draft, budget })} />
        <FormField label="Guest Count" value={draft.guest_count}
          onChange={(guest_count) => onDraft({ ...draft, guest_count })} />
        <label className="grid gap-2 text-sm font-semibold">Wedding Style
          <select value={draft.wedding_style}
            onChange={(event) => onDraft({ ...draft, wedding_style: event.target.value })}
            className="rounded-lg border border-stone-200 px-4 py-3 outline-none">
            {styles.map((style) => <option key={style}>{style}</option>)}
          </select>
        </label>
      </div>
      <textarea value={draft.preferences}
        onChange={(event) => onDraft({ ...draft, preferences: event.target.value })}
        className="mt-4 min-h-28 w-full rounded-lg border border-stone-200 p-4 outline-none"
        placeholder="Tell us about colors, themes, venues, and dream details." />
      <button onClick={onSave} className="mt-6 rounded-lg bg-[#111111] px-6 py-3 text-sm font-semibold text-white">
        Save Preferences
      </button>
    </SettingsCard>
  );
}
