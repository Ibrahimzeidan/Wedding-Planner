const heroImageUrl =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:gap-10 lg:px-8 lg:py-20 xl:px-10">
      <div>
        <p className="text-sm font-semibold uppercase text-stone-500">Elegant AI wedding planning</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#111111] sm:text-6xl">
          About Smart Wedding Planner
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:mt-6 sm:text-lg sm:leading-8">
          Smart Wedding Planner helps couples plan beautiful weddings using AI. The platform supports
          vendor discovery, budget planning, service comparison, and booking organization in one calm,
          easy-to-use space.
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow-soft">
        <img
          src={heroImageUrl}
          alt="Elegant wedding celebration setup"
          className="h-64 w-full object-cover transition duration-500 hover:scale-105 sm:h-80 lg:h-96"
        />
      </div>
    </section>
  );
}
