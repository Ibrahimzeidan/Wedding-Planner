import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "dark" | "light" | "outline";
};

const variants = {
  dark: "bg-[#111111] text-white hover:bg-[#2b2b2b]",
  light: "bg-white text-[#111111] hover:bg-[#efefef]",
  outline: "border border-[#111111]/25 bg-transparent text-[#111111] hover:bg-white",
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-stone-300";

export default function Button({
  children,
  className = "",
  href,
  variant = "dark",
  ...props
}: ButtonProps) {
  const styles = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
