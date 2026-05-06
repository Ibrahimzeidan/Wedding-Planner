import SectionHeader from "./SectionHeader";

const services = [
  ["Wedding Hall", "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80"],
  ["Photographer", "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=700&q=80"],
  ["Catering", "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=80"],
  ["Decoration", "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=80"],
  ["Makeup Artist", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=80"],
  ["DJ / Music", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80"],
  ["Dress Shop", "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=700&q=80"],
  ["Car Rental", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80"],
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-event-paper px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Browse by category"
            title="Everything your wedding needs"
            description="Explore the main provider categories that help couples move from inspiration to reservation."
            align="left"
          />
          <a href="/register" className="hidden text-sm font-semibold text-[#111111] underline sm:block">
            view all
          </a>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, image]) => (
            <article key={title} className="group bg-white p-3 shadow-soft">
              <div className="overflow-hidden">
                <img
                  src={image}
                  alt={`${title} service`}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="px-1 py-4 text-lg font-semibold text-[#111111]">{title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
