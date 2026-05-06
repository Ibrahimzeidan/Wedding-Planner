export default function StorySection() {
  return (
    <section className="border-y border-[#111111]/10 bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-stone-500">Our story</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#111111] sm:text-5xl">
            Built to remove planning stress.
          </h2>
        </div>

        <div className="space-y-4 text-base leading-7 text-stone-600 sm:space-y-5 sm:text-lg sm:leading-8">
          <p>
            Wedding planning can quickly become stressful. Couples often need to compare many vendors,
            manage budgets, track availability, and organize bookings manually across messages,
            spreadsheets, and separate websites.
          </p>
          <p>
            Smart Wedding Planner was created to solve this problem. It brings the most important
            planning steps into one platform and uses AI to help couples make faster, clearer, and more
            affordable decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
