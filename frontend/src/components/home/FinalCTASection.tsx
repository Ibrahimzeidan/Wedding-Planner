import Button from "@/components/ui/Button";

export default function FinalCTASection() {
  return (
    <section className="bg-event-paper px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-5xl bg-white p-6 text-center shadow-soft sm:p-12">
        <p className="text-sm font-semibold uppercase text-stone-500">Start today</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#111111] sm:text-5xl">
          Ready to plan your perfect wedding?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">
          Create your first wedding plan and let smart recommendations help you choose the right services.
        </p>
        <Button href="/register" className="mt-8 w-full sm:w-auto">Create Your Wedding Plan</Button>
      </div>
    </section>
  );
}
