import { CalendarDays, ClipboardList, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Step = {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    label: "Step 1",
    title: "Enter your wedding details",
    description: "Add your date, location, guest count, budget, and preferred wedding style.",
    icon: ClipboardList,
  },
  {
    label: "Step 2",
    title: "Get AI recommendations",
    description: "Get smart suggestions for halls, photographers, catering, decoration, and more.",
    icon: Sparkles,
  },
  {
    label: "Step 3",
    title: "Book trusted service providers",
    description: "Compare providers, choose the right fit, and keep each booking organized.",
    icon: CalendarDays,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How it works"
          title="Simple steps from idea to celebration"
          description="Start with your wedding basics, let the platform guide your options, then manage the plan with confidence."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.label} className="border border-[#111111]/10 bg-event-paper p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-6 text-sm font-semibold uppercase text-stone-500">{step.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#111111]">{step.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
