import type { AccountData } from "@/types/account";

export function buildCustomerDraft(account: AccountData) {
  const profile = account.profile;
  const preferences = profile.preferences as Record<string, string> | undefined;
  return {
    full_name: account.user.full_name,
    phone: text(profile.phone),
    location: text(profile.location),
    wedding_date: text(profile.wedding_date),
    budget: text(profile.budget),
    guest_count: text(profile.guest_count),
    wedding_style: preferences?.style ?? "Classic Wedding",
    preferences: preferences?.notes ?? "",
  };
}

export function buildProviderDraft(account: AccountData) {
  const profile = account.profile;
  const availability = parseAvailability(text(profile.availability));
  return {
    full_name: account.user.full_name,
    business_name: text(profile.business_name) || account.user.full_name,
    description: text(profile.description),
    phone: text(profile.phone),
    location: text(profile.location),
    website: text(profile.website),
    category_id: text(profile.category_id),
    available_days: availability.available_days,
    start_time: availability.start_time,
    end_time: availability.end_time,
  };
}

export function customerPayload(draft: Record<string, string>) {
  return {
    full_name: draft.full_name,
    phone: draft.phone,
    location: draft.location,
    wedding_date: draft.wedding_date || null,
    budget: Number(draft.budget) || null,
    guest_count: Number(draft.guest_count) || null,
    preferences: { style: draft.wedding_style, notes: draft.preferences },
  };
}

export function providerPayload(draft: Record<string, string>) {
  return {
    full_name: draft.full_name,
    business_name: draft.business_name,
    description: draft.description,
    phone: draft.phone,
    location: draft.location,
    category_id: Number(draft.category_id) || null,
    availability: JSON.stringify({
      available_days: draft.available_days,
      start_time: draft.start_time,
      end_time: draft.end_time,
    }),
  };
}

function parseAvailability(value: string) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}
