import FormField from "@/components/account/FormField";
import ProfilePhotoUpload from "@/components/account/ProfilePhotoUpload";
import SettingsCard from "@/components/account/SettingsCard";
import type { AccountData } from "@/types/account";
import type { AdminCategory } from "@/types/admin";

type BusinessInfoFormProps = {
  account: AccountData;
  categories: AdminCategory[];
  draft: Record<string, string>;
  onDraft: (draft: Record<string, string>) => void;
  onPhoto: (image: string) => void;
  onSave: () => void;
};

export default function BusinessInfoForm(props: BusinessInfoFormProps) {
  const { account, categories, draft, onDraft, onPhoto, onSave } = props;
  return (
    <SettingsCard title="Business Information">
      <div className="grid gap-8 lg:grid-cols-[170px_1fr]">
        <ProfilePhotoUpload image={account.user.profile_image} name={draft.business_name}
          label="Change Logo" onChange={onPhoto} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Business Name" value={draft.business_name}
            onChange={(business_name) => onDraft({ ...draft, business_name })} />
          <label className="grid gap-2 text-sm font-semibold">Service Category
            <select value={draft.category_id}
              onChange={(event) => onDraft({ ...draft, category_id: event.target.value })}
              className="rounded-lg border border-stone-200 px-4 py-3 outline-none">
              <option value="">Select category</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <FormField label="Email Address" value={account.user.email} onChange={() => undefined} />
          <FormField label="Phone Number" value={draft.phone} onChange={(phone) => onDraft({ ...draft, phone })} />
          <FormField label="Location" value={draft.location} onChange={(location) => onDraft({ ...draft, location })} />
          <FormField label="Website" value={draft.website} onChange={(website) => onDraft({ ...draft, website })} />
        </div>
      </div>
      <textarea value={draft.description}
        onChange={(event) => onDraft({ ...draft, description: event.target.value })}
        className="mt-4 min-h-28 w-full rounded-lg border border-stone-200 p-4 outline-none" />
      <button onClick={onSave} className="mt-6 rounded-lg bg-purple-400 px-6 py-3 text-sm font-semibold text-white">
        Save Changes
      </button>
    </SettingsCard>
  );
}
