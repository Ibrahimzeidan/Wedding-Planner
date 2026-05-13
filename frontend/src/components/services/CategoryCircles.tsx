import { serviceCategories } from "@/lib/weddingData";

export default function CategoryCircles() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-9 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Service Categories</h2>
        <a href="#" className="text-sm">view all</a>
      </div>
      <div className="grid grid-cols-2 gap-9 sm:grid-cols-4 lg:grid-cols-7">
        {serviceCategories.map(([name, image]) => (
          <article key={name} className="text-center">
            <img src={image} alt={name} className="mx-auto h-24 w-24 rounded-full object-cover" />
            <h3 className="mt-3 text-sm font-medium">{name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
