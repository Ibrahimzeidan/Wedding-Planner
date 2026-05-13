import { Mail, MapPin, Phone } from "lucide-react";

const items = [
  ["Email", "hello@happilyeverafters.com", Mail],
  ["Phone", "+961 70 555 000", Phone],
  ["Location", "Beirut, Lebanon", MapPin],
] as const;

export default function ContactInfoPanel() {
  return (
    <aside className="rounded-2xl border border-[#111111]/10 bg-[#111111] p-6 text-white shadow-soft">
      <p className="text-sm font-semibold uppercase text-white/60">Contact Details</p>
      <h2 className="mt-3 text-2xl font-semibold">We are here for your wedding questions.</h2>
      <div className="mt-8 grid gap-4">
        {items.map(([label, value, Icon]) => (
          <div key={label} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Icon className="mt-1 h-5 w-5 text-rose-200" />
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-sm text-white/70">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
