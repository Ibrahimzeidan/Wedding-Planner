import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`border border-[#111111]/10 bg-white shadow-[0_18px_40px_rgba(17,17,17,0.08)] ${className}`}>
      {children}
    </div>
  );
}
