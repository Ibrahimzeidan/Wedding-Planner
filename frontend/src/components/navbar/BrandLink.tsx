import Link from "next/link";

export default function BrandLink() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-lg font-semibold text-white">
        SW
      </span>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-white sm:text-lg">Smart Wedding Planner</p>
        <p className="hidden text-xs text-white/65 sm:block">wedding events</p>
      </div>
    </Link>
  );
}
