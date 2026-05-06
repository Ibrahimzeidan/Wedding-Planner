import { type LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "pink" | "gold" | "burgundy";
  id?: string;
};

const accentStyles = {
  pink: "bg-event-paper text-[#111111] ring-[#111111]/10",
  gold: "bg-white text-[#111111] ring-[#111111]/10",
  burgundy: "bg-[#111111] text-white ring-[#111111]/20",
};

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  accent = "pink",
  id,
}: DashboardCardProps) {
  return (
    <article id={id} className="border border-[#111111]/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${accentStyles[accent]}`}>
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#111111]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </article>
  );
}
