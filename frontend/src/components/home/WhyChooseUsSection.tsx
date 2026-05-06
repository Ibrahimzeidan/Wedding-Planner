import { BrainCircuit, Clock, ShieldCheck, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "Save time",
    description: "Organize wedding decisions faster with one clear place for planning.",
    icon: Clock,
  },
  {
    title: "Stay within budget",
    description: "Match services to your budget before you spend time comparing the wrong options.",
    icon: WalletCards,
  },
  {
    title: "Smart AI planning",
    description: "Get recommendations that respond to your wedding details and preferences.",
    icon: BrainCircuit,
  },
  {
    title: "Trusted service providers",
    description: "Build your wedding plan around reliable providers across every category.",
    icon: ShieldCheck,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-event-paper px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why choose us"
          title="A smarter way to plan every detail"
          description="Smart Wedding Planner keeps the experience elegant, organized, and practical from the first idea to the final booking."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="border border-[#111111]/10 bg-white p-6 shadow-soft transition hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#111111]">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
