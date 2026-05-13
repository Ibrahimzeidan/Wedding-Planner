import type { ReactNode } from "react";

type SettingsCardProps = {
  title: string;
  children: ReactNode;
};

export default function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-soft">
      <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
