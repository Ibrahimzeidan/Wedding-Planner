type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

const alignStyles = {
  left: "items-start text-left",
  center: "mx-auto items-center text-center",
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: PageHeaderProps) {
  return (
    <div className={alignStyles[align]}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} align={align} />
    </div>
  );
}
import SectionHeader from "@/components/ui/SectionHeader";
