type WeddingHeroProps = {
  image: string;
  title?: string;
  tall?: boolean;
};

export default function WeddingHero({ image, title, tall = false }: WeddingHeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center bg-cover bg-center text-white ${
        tall ? "min-h-[520px]" : "min-h-[340px]"
      }`}
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,.42)), url(${image})` }}
    >
      {title && <h1 className="px-4 pt-20 text-center text-3xl font-semibold sm:text-5xl">{title}</h1>}
    </section>
  );
}
