import { images } from "@/lib/weddingData";

export default function AboutRedesign() {
  return (
    <div className="bg-[#efefef] px-4 pb-20 pt-36">
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-semibold">About Us</h1>
        <p className="mx-auto mt-12 max-w-4xl text-2xl leading-relaxed">
          Happily Ever Afters helps couples discover venues, services, inspiration, and trusted providers in one calm planning space.
        </p>
      </section>
      <section className="mx-auto mt-28 grid max-w-6xl items-center gap-10 md:grid-cols-3">
        <div>
          <img src={images.homeHero} alt="Bride holding flowers" className="h-[420px] w-full object-cover" />
          <p className="mt-16 text-center text-6xl font-bold">50+</p>
          <p className="text-center text-5xl text-green-800">reviews</p>
        </div>
        <div className="text-center">
          <p className="text-6xl font-bold">80+</p>
          <p className="text-5xl text-green-800">Projects</p>
          <img src={images.contactHero} alt="Wedding toast" className="mx-auto mt-24 h-[360px] object-cover grayscale" />
        </div>
        <img src={images.venueHero} alt="Evening wedding couple" className="h-[560px] w-full object-cover" />
      </section>
    </div>
  );
}
