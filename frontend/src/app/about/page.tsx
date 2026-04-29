const values = [
  "Simple tools for couples and planners",
  "Elegant design that feels calm and organized",
  "A foundation ready for future planning features",
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-champagne-700">About us</p>
      <h1 className="mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">Built for joyful planning.</h1>
      <p className="mt-6 text-lg leading-8 text-stone-600">
        Smart Wedding Planner is designed to become a modern platform where couples can manage every
        wedding detail in one clean, friendly space. Day 1 focuses on the structure, pages, and visual
        foundation for the full product.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <article key={value} className="rounded-2xl border border-blush-100 bg-white p-6 shadow-soft">
            <span className="block h-1.5 w-12 rounded-full bg-champagne-500" />
            <p className="mt-5 font-medium leading-7 text-stone-700">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
