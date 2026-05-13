import type { UserRole } from "@/lib/auth";

const panelImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=160&q=70",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=160&q=70",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=160&q=70",
];

export default function ProfilePanels({ role }: { role: UserRole }) {
  const provider = role === "service_provider";
  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-2">
      <Panel title={provider ? "Booking Requests" : "Upcoming Bookings"} items={["Dream Palace", "Michael Anderson", "Blissful Decor"]} />
      <Panel title={provider ? "My Packages" : "Favorite Services"} items={["Venues", "Photographers", "Decorations"]} images />
      <Panel title={provider ? "Recent Reviews" : "Recent Messages"} items={["Excellent service", "Confirmed booking", "Requirements received"]} />
      <Quote provider={provider} />
    </section>
  );
}

function Panel({ title, items, images = false }: { title: string; items: string[]; images?: boolean }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex justify-between"><h2 className="font-bold">{title}</h2><a className="text-sm text-rose-500">View all</a></div>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-stone-100 p-3">
            {images && <img src={panelImages[index]} alt="" className="h-14 w-20 rounded-lg object-cover" />}
            <div><p className="text-sm font-bold">{item}</p><p className="text-xs text-stone-500">20 Dec 2025</p></div>
          </div>
        ))}
      </div>
    </article>
  );
}

function Quote({ provider }: { provider: boolean }) {
  return (
    <article className="flex min-h-48 items-center rounded-2xl bg-rose-50 p-8 text-center shadow-soft">
      <p className="mx-auto text-xl italic text-stone-700">
        {provider ? "$8,450 this month. Keep growing your bookings." : "We make your dream wedding a beautiful reality."}
      </p>
    </article>
  );
}
