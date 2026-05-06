import { CalendarCheck, Sparkles, UsersRound, WalletCards, type LucideIcon } from "lucide-react";

import SectionTitle from "./SectionTitle";

type HelpCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const helpCards: HelpCard[] = [
  {
    title: "AI Recommendations",
    description: "Get smart suggestions for vendors, services, and planning steps based on your wedding style.",
    icon: Sparkles,
  },
  {
    title: "Budget Planning",
    description: "Track estimated costs, compare options, and make decisions that fit your total budget.",
    icon: WalletCards,
  },
  {
    title: "Trusted Service Providers",
    description: "Find reliable photographers, caterers, halls, decorators, and other wedding professionals.",
    icon: UsersRound,
  },
  {
    title: "Easy Booking",
    description: "Organize booking details in one place so your planning stays clear and manageable.",
    icon: CalendarCheck,
  },
];

export default function HowWeHelp() {
  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="How we help"
          title="Everything couples need to plan with confidence."
          description="Smart tools keep the planning process organized, visual, and simple from the first idea to the final booking."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {helpCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="border border-[#111111]/10 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#111111]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
