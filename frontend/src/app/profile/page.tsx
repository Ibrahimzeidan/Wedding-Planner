const stats = [
  { label: "Wedding date", value: "September 12, 2026" },
  { label: "Guest count", value: "148" },
  { label: "Budget", value: "$28,500" },
  { label: "Checklist", value: "32/48" },
];

const planningChecklist = [
  {
    title: "Finalize ceremony timeline",
    detail: "Review draft with officiant",
    status: "In progress",
  },
  {
    title: "Confirm floral proposal",
    detail: "Luna Floral Studio",
    status: "Pending approval",
  },
  {
    title: "Menu tasting",
    detail: "Savor & Vine Catering",
    status: "Scheduled May 23, 2026",
  },
];

const vendorUpdates = [
  {
    name: "Luna Floral Studio",
    role: "Florist",
    status: "Proposal received",
  },
  {
    name: "Savor & Vine Catering",
    role: "Catering",
    status: "Menu draft shared",
  },
  {
    name: "Golden Hour Photo",
    role: "Photography",
    status: "Contract sent",
  },
];

const palette = ["#d96b8f", "#f7a8be", "#f0d68a", "#fff8e7"];

export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne-700">Profile</p>
          <h1 className="mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">
            Your wedding profile at a glance.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Track your couple details, vision, and upcoming milestones all in one calm workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-champagne-300 px-5 py-2 text-sm font-semibold text-champagne-700 transition hover:bg-champagne-100">
            Download summary
          </button>
          <button className="rounded-full bg-blush-500 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-blush-300">
            Edit profile
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-xl font-semibold text-blush-500">
              EJ
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Emily Johnson & James Lee</h2>
              <p className="text-sm text-stone-500">Chicago, IL · Modern garden celebration</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 text-sm text-stone-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-500">Primary contact</span>
              <span>emily.johnson@email.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-500">Phone</span>
              <span>(312) 555-0198</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-500">Planner</span>
              <span>Olivia Ramos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-500">Venue</span>
              <span>The Willow Conservatory</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blush-50 p-4">
            <p className="text-sm font-semibold text-stone-700">Wedding vision</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Soft neutrals, candlelit reception, and a garden ceremony with live acoustic music.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {palette.map((color) => (
                <span
                  key={color}
                  className="h-8 w-8 rounded-full border border-white shadow-soft"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-stone-700">Planning progress</span>
              <span className="font-semibold text-stone-900">68%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-blush-100">
              <div className="h-full rounded-full bg-blush-500" style={{ width: "68%" }} />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-champagne-700">
              Planning snapshot
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-blush-100 bg-blush-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{stat.label}</p>
                  <p className="mt-3 text-lg font-semibold text-stone-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-champagne-700">
              Upcoming tasks
            </p>
            <div className="mt-5 grid gap-4">
              {planningChecklist.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blush-100 bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-stone-900">{item.title}</p>
                    <p className="text-sm text-stone-500">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-500">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-champagne-700">
              Vendor updates
            </p>
            <div className="mt-5 grid gap-4">
              {vendorUpdates.map((vendor) => (
                <div key={vendor.name} className="rounded-2xl bg-blush-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{vendor.name}</p>
                      <p className="text-sm text-stone-500">{vendor.role}</p>
                    </div>
                    <span className="text-xs font-semibold text-stone-600">{vendor.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
