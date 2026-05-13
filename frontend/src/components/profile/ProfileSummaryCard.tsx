import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { AccountData } from "@/types/account";

export default function ProfileSummaryCard({ account }: { account: AccountData }) {
  const profile = account.profile;
  const provider = account.role === "service_provider";
  const title = provider ? String(profile.business_name || account.user.full_name) : account.user.full_name;
  return (
    <section className="rounded-2xl bg-white p-6 shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[150px_1fr_auto]">
        <img src={account.user.profile_image || "/images/logo.jpeg"} alt={title}
          className="h-32 w-32 rounded-full object-cover" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{title}</h1>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
              {provider ? "Photographer" : "Customer"}
            </span>
          </div>
          <Info icon={Mail} text={account.user.email} />
          <Info icon={Phone} text={String(profile.phone || "No phone added")} />
          <Info icon={MapPin} text={String(profile.location || "No location added")} />
          <Link href="/account/settings" className="mt-4 inline-flex rounded-lg bg-rose-500 px-5 py-2 text-sm font-semibold text-white">
            Edit Profile
          </Link>
        </div>
        <Stats account={account} />
      </div>
    </section>
  );
}

function Info({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return <p className="mt-3 flex items-center gap-2 text-sm text-stone-600"><Icon className="h-4 w-4" />{text}</p>;
}

function Stats({ account }: { account: AccountData }) {
  const profile = account.profile;
  if (account.role === "service_provider") {
    return <div className="grid content-center gap-3 text-sm">
      <b>Rating</b><span>4.8 (120)</span><b>Completed Projects</b><span>320+</span>
    </div>;
  }
  return <div className="grid content-center gap-3 text-sm">
    <b>Wedding Date</b><span>{String(profile.wedding_date || "Not set")}</span>
    <b>Wedding Budget</b><span>{String(profile.budget || "Not set")}</span>
    <b>Guest Count</b><span>{String(profile.guest_count || "Not set")}</span>
  </div>;
}
