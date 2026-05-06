import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ className = "", label, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <input
        className={`w-full min-w-0 border-0 border-b border-[#111111]/25 bg-transparent px-0 py-3 text-[#111111] outline-none transition placeholder:text-stone-400 focus:border-[#111111] ${className}`}
        {...props}
      />
    </label>
  );
}
