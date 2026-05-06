import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type AdminCardProps = {
  title: string;
  value?: string | number;
  description?: string;
  href?: string;
  icon: LucideIcon;
};

export default function AdminCard({ title, value, description, href, icon: Icon }: AdminCardProps) {
  const content = (
    <article className="h-full border border-[#111111]/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-600">{title}</p>
          {value !== undefined && <p className="mt-2 text-3xl font-semibold text-[#111111]">{value}</p>}
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white">
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      {description && <p className="mt-4 text-sm leading-6 text-stone-600">{description}</p>}
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
