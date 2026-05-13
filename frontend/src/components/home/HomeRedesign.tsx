import ImageCardGrid from "@/components/ui/ImageCardGrid";
import QuoteBanner from "@/components/ui/QuoteBanner";
import SearchFilters from "@/components/ui/SearchFilters";
import WeddingHero from "@/components/ui/WeddingHero";
import { categories, images, venues } from "@/lib/weddingData";

const stories = [
  ["Bride portrait", "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80"],
  ["Couple story", "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80"],
  ["Garden wedding", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"],
];

export default function HomeRedesign() {
  return (
    <div className="bg-[#efefef]">
      <WeddingHero image={images.homeHero} tall />
      <SearchFilters />
      <ImageCardGrid title="Browse By Category" items={categories} viewAllHref="/services" />
      <ImageCardGrid title="Popular Venue" items={venues} viewAllHref="/venues" />
      <Quote />
      <ImageCardGrid title="Love Stories" items={stories} />
      <Reviews />
      <Collage />
      <Consultation />
    </div>
  );
}

function Quote() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-16 md:grid-cols-2">
      <img src={images.contactHero} alt="Wedding couple" className="h-80 w-full object-cover grayscale" />
      <p className="text-center text-2xl italic">
        “Ready to Turn your dream wedding into reality? Contact us today and let's start planning your perfect days!”
      </p>
    </section>
  );
}

function Reviews() {
  return (
    <section className="px-4 py-12 text-center">
      <h2 className="mx-auto max-w-6xl text-left text-lg font-semibold">Reviews</h2>
      <div className="mx-auto mt-8 max-w-xl rounded-xl bg-emerald-700 px-8 py-9 text-white shadow-soft">
        <p className="font-semibold">Adam Joan</p>
        <p className="mt-4 text-sm">A thoughtful service and a beautiful way to plan each detail.</p>
      </div>
    </section>
  );
}

function Collage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:items-center">
      {stories.map(([name, image], index) => (
        <img key={name} src={image} alt={name} className={`w-full object-cover shadow-soft ${index === 1 ? "h-80" : "h-72"}`} />
      ))}
    </section>
  );
}

function Consultation() {
  return (
    <section className="px-4 py-20 text-center">
      <h2 className="text-3xl font-bold">Reserve a consultation</h2>
      <form className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-[1fr_1fr_auto]">
        <input className="border-b border-stone-400 bg-transparent px-2 py-2" placeholder="Full Name" />
        <input className="border-b border-stone-400 bg-transparent px-2 py-2" placeholder="Phone Number" />
        <button className="rounded-full bg-black px-8 py-2 text-sm font-semibold text-white">SEND</button>
      </form>
    </section>
  );
}
