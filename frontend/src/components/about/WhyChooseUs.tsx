import { BadgeDollarSign, Clock, MousePointerClick, RefreshCw, type LucideIcon } from "lucide-react";

import SectionTitle from "./SectionTitle";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "Save time",
    description: "Reduce manual searching and keep planning tasks easier to manage.",
    icon: Clock,
  },
  {
    title: "Stay within budget",
    description: "Compare services and make confident choices before costs get out of control.",
    icon: BadgeDollarSign,
  },
  {
    title: "Real-time AI updates",
    description: "Receive smarter planning guidance as your wedding details change.",
    icon: RefreshCw,
  },
  {
    title: "Simple booking experience",
    description: "Move from inspiration to action with a clean and organized booking flow.",
    icon: MousePointerClick,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10 xl:py-24">
      <SectionTitle
        eyebrow="Why choose us"
        title="A smarter way to plan your wedding."
        description="The platform is designed to save effort, protect budgets, and make booking feel simple."
      />

      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article
              key={benefit.title}
                className="border border-[#111111]/10 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#111111]">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{benefit.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
