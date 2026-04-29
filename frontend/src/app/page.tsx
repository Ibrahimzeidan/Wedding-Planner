import Link from "next/link";

const highlights = [
  "Guest list organization",
  "Vendor planning",
  "Budget tracking",
  "Timeline reminders",
];

export default function HomePage() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne-700">
          Wedding planning made simple
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
          Plan every wedding detail with elegance and clarity.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          Smart Wedding Planner helps couples organize the big day with a clean dashboard, helpful tools,
          and a beautiful experience from day one.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-blush-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-blush-300"
          >
            Start Planning
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-champagne-300 px-6 py-3 text-center text-sm font-semibold text-champagne-700 transition hover:bg-champagne-100"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="rounded-[2rem] border border-blush-100 bg-white p-6 shadow-soft">
        <div className="rounded-[1.5rem] bg-blush-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-champagne-700">Day 1 Preview</p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-950">Your planning foundation</h2>
          <div className="mt-6 grid gap-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-blush-100">
                <span className="h-3 w-3 rounded-full bg-champagne-500" />
                <span className="font-medium text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
