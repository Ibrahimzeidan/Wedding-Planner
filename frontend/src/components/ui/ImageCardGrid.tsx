type ImageCardGridProps = {
  title: string;
  items: string[][];
  rating?: boolean;
  viewAllHref?: string;
};

export default function ImageCardGrid({ title, items, rating = false, viewAllHref = "#" }: ImageCardGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <a className="text-sm" href={viewAllHref}>view all</a>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([name, image]) => (
          <article key={`${title}-${name}`}>
            <img src={image} alt={name} className="h-36 w-full rounded-xl object-cover" />
            <h3 className="mt-3 text-sm font-semibold">{name}</h3>
            {rating && <p className="text-sm">★★★★★ <span className="font-semibold">(33)</span></p>}
            {rating && <p className="text-xs text-stone-600">up to 500-1000 guests</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
