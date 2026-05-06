type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

const alignStyles = {
  left: "items-start text-left",
  center: "mx-auto items-center text-center",
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={`flex max-w-3xl flex-col ${alignStyles[align]}`}>
      {eyebrow && <p className="text-sm font-semibold uppercase text-stone-500">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#111111] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <span className="mt-4 h-px w-28 bg-[#111111]" aria-hidden="true" />
      {description && <p className="mt-5 text-base leading-7 text-stone-600">{description}</p>}
    </div>
  );
}
