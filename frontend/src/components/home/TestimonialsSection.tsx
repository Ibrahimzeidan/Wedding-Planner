import { MessageSquareQuote } from "lucide-react";
import SectionHeader from "./SectionHeader";

const testimonials = [
  {
    quote: "The planner helped us compare services quickly and made the first week of planning feel simple.",
    name: "Maya and Karim",
    detail: "Summer wedding",
  },
  {
    quote: "Changing our guest count updated the kind of services we needed. That saved us so much time.",
    name: "Lina",
    detail: "Bride-to-be",
  },
  {
    quote: "It felt like having a clear plan instead of a long list of scattered decisions.",
    name: "Nour and Elias",
    detail: "Engaged couple",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="Loved by couples planning ahead"
          description="Simple feedback from couples who want a calmer way to prepare for their wedding day."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="border border-[#111111]/10 bg-event-paper p-6">
              <MessageSquareQuote className="h-7 w-7 text-[#111111]" aria-hidden="true" />
              <p className="mt-5 leading-7 text-stone-700">&quot;{testimonial.quote}&quot;</p>
              <div className="mt-6 border-t border-[#111111]/10 pt-4">
                <p className="font-semibold text-[#111111]">{testimonial.name}</p>
                <p className="mt-1 text-sm text-stone-500">{testimonial.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
