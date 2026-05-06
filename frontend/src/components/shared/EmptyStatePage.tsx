import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type EmptyStatePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel: string;
  actionHref: string;
  icon: LucideIcon;
};

export default function EmptyStatePage({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  actionLabel,
  actionHref,
  icon: Icon,
}: EmptyStatePageProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
      <div className="border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase text-stone-500">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111111] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">{description}</p>
      </div>

      <div className="mt-6 border border-[#111111]/10 bg-white p-6 text-center shadow-soft sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-white">
          <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-[#111111]">{emptyTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">{emptyDescription}</p>
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}
