import FormField from "@/components/account/FormField";
import ProfilePhotoUpload from "@/components/account/ProfilePhotoUpload";
import SettingsCard from "@/components/account/SettingsCard";
import type { AccountData } from "@/types/account";

type PersonalInfoFormProps = {
  account: AccountData;
  draft: Record<string, string>;
  onDraft: (draft: Record<string, string>) => void;
  onPhoto: (image: string) => void;
  onSave: () => void;
};

export default function PersonalInfoForm(props: PersonalInfoFormProps) {
  const { account, draft, onDraft, onPhoto, onSave } = props;
  return (
    <SettingsCard title="Profile Information">
      <div className="grid gap-8 lg:grid-cols-[170px_1fr]">
        <ProfilePhotoUpload image={account.user.profile_image} name={account.user.full_name}
          label="Change Photo" onChange={onPhoto} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" value={draft.full_name}
            onChange={(full_name) => onDraft({ ...draft, full_name })} />
          <FormField label="Email Address" value={account.user.email} onChange={() => undefined} />
          <FormField label="Phone Number" value={draft.phone}
            onChange={(phone) => onDraft({ ...draft, phone })} />
          <FormField label="Location" value={draft.location}
            onChange={(location) => onDraft({ ...draft, location })} />
        </div>
      </div>
      <Actions onSave={onSave} />
    </SettingsCard>
  );
}

function Actions({ onSave }: { onSave: () => void }) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <button className="rounded-lg border px-6 py-3 text-sm font-semibold" type="button">Cancel</button>
      <button onClick={onSave} className="rounded-lg bg-rose-500 px-6 py-3 text-sm font-semibold text-white" type="button">
        Save Changes
      </button>
    </div>
  );
}
