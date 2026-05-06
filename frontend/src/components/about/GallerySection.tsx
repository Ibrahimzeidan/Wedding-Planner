import SectionTitle from "./SectionTitle";

type GalleryImage = {
  title: string;
  imageUrl: string;
  alt: string;
};

const galleryImages: GalleryImage[] = [
  {
    title: "Wedding Hall",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    alt: "Elegant wedding hall with decorated tables",
  },
  {
    title: "Catering",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    alt: "Wedding catering table with prepared dishes",
  },
  {
    title: "Photographer",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    alt: "Wedding photographer capturing a couple",
  },
  {
    title: "Decoration",
    imageUrl: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80",
    alt: "Soft floral wedding decoration",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-event-paper px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Photo gallery"
          title="A visual preview of wedding services."
          description="These placeholder images show the kinds of services couples can explore inside the platform."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {galleryImages.map((image) => (
            <article
              key={image.title}
              className="group overflow-hidden bg-white shadow-soft"
            >
              <img
                src={image.imageUrl}
                alt={image.alt}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
              />
              <div className="border-t border-[#111111]/10 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-[#111111]">{image.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
