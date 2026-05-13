"use client";

import { useEffect, useState } from "react";
import AvailabilityForm from "@/components/account/AvailabilityForm";
import BusinessInfoForm from "@/components/account/BusinessInfoForm";
import PasswordForm from "@/components/account/PasswordForm";
import PersonalInfoForm from "@/components/account/PersonalInfoForm";
import ProviderPackagesEditor from "@/components/provider-packages/ProviderPackagesEditor";
import SettingsCard from "@/components/account/SettingsCard";
import SettingsSidebar from "@/components/account/SettingsSidebar";
import WeddingPreferencesForm from "@/components/account/WeddingPreferencesForm";
import { buildCustomerDraft, buildProviderDraft, customerPayload, providerPayload } from "./accountDrafts";
import { getMyAccount, updateMyAccount, updateMyPhoto } from "@/lib/accountApi";
import { apiBaseUrl, getAuthSession, saveAuthSession } from "@/lib/auth";
import type { AccountData } from "@/types/account";
import type { AdminCategory } from "@/types/admin";

export default function AccountSettings() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    getMyAccount().then((res) => {
      setAccount(res.data);
      setTab(res.data.role === "service_provider" ? "business" : "profile");
      setDraft(res.data.role === "service_provider" ? buildProviderDraft(res.data) : buildCustomerDraft(res.data));
    }).catch((error) => setMessage(error.message));
    fetch(`${apiBaseUrl}/service-categories`).then((res) => res.json()).then(setCategories).catch(() => undefined);
  }, []);

  if (!account) return <div className="p-10 text-center">Loading account settings...</div>;
  const provider = account.role === "service_provider";

  async function saveProfile() {
    const payload = provider ? providerPayload(draft) : customerPayload(draft);
    const response = await updateMyAccount(payload);
    setAccount(response.data);
    syncSession(response.data);
    setMessage(response.message);
  }

  async function savePhoto(image: string) {
    const response = await updateMyPhoto(image);
    setAccount(response.data);
    syncSession(response.data);
    setMessage(response.message);
  }

  return (
    <section className="bg-[#f4f4f4] px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">{provider ? "Business Profile" : "Edit Profile"}</h1>
        <p className="mt-2 text-sm text-stone-500">Dashboard / Settings / Profile</p>
        {message && <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm shadow-soft">{message}</p>}
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <SettingsSidebar active={tab} role={account.role} onChange={setTab} />
          {tab === "profile" && <PersonalInfoForm account={account} draft={draft} onDraft={setDraft} onPhoto={savePhoto} onSave={saveProfile} />}
          {tab === "business" && <BusinessInfoForm account={account} categories={categories} draft={draft} onDraft={setDraft} onPhoto={savePhoto} onSave={saveProfile} />}
          {tab === "wedding" && <WeddingPreferencesForm draft={draft} onDraft={setDraft} onSave={saveProfile} />}
          {tab === "availability" && <AvailabilityForm draft={draft} onDraft={setDraft} onSave={saveProfile} />}
          {tab === "password" && <PasswordForm onMessage={setMessage} />}
          {tab === "packages" && <ProviderPackagesEditor compact />}
          {tab === "notifications" && <SettingsCard title="Coming Soon"><p>This section is ready for future settings.</p></SettingsCard>}
        </div>
      </div>
    </section>
  );
}

function syncSession(account: AccountData) {
  const session = getAuthSession();
  if (!session) return;
  saveAuthSession({ ...session, user: { ...session.user, ...account.user } });
}
