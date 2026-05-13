type ProviderSectionProps = {
  title: string;
  items: string[][];
};

export default function ProviderSection({ title, items }: ProviderSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <a href="#" className="text-sm">view all</a>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([name, packageTitle, image]) => (
          <article key={`${title}-${name}`}>
            <img src={image} alt={name} className="h-52 w-full object-cover" />
            <h3 className="mt-3 text-sm font-semibold">{name}</h3>
            <p className="text-sm font-semibold">{packageTitle}</p>
            <p className="text-sm">★★★★★ <span className="font-semibold">(33)</span></p>
          </article>
        ))}
      </div>
    </section>
  );
}
