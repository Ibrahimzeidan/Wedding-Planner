import Button from "@/components/ui/Button";

const imageUrl =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85";

export default function AboutPreview() {
  return (
    <section className="bg-event-paper px-4 py-14 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <img src={imageUrl} alt="Wedding couple walking together" className="h-[420px] w-full object-cover" />
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-stone-500">About us</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#111111] sm:text-5xl">
            Ready to turn your dream wedding into reality?
          </h2>
          <p className="mt-5 leading-7 text-stone-600">
            Smart Wedding Planner keeps couples and providers connected with a simple, organized,
            and beautiful planning experience inspired by modern wedding event studios.
          </p>
          <Button href="/about" variant="outline" className="mt-8">Read More</Button>
        </div>
      </div>
    </section>
  );
}
