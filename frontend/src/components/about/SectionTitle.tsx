import SectionHeader from "@/components/ui/SectionHeader";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return <SectionHeader eyebrow={eyebrow} title={title} description={description} />;
}
