import Link from "next/link";
import { ReactNode } from "react";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  children: ReactNode;
};

export default function DashboardShell({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: DashboardShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
      <div className="border border-[#111111]/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-stone-500">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#111111] sm:text-5xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">{description}</p>
          </div>

          <Link
            href={actionHref}
            className="inline-flex w-full justify-center rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] sm:w-auto"
          >
            {actionLabel}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
    </section>
  );
}
