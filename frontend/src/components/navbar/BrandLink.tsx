import Link from "next/link";

export default function BrandLink() {
  return (
    <Link href="/" className="flex min-w-0 items-center">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold italic text-white sm:text-lg">
          Happily Ever Afters
        </p>
        <p className="hidden text-xs tracking-wide text-white/75 sm:block">wedding events</p>
      </div>
    </Link>
  );
}
