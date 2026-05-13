type Props = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
};

export default function FormField({ label, value, onChange, required, multiline }: Props) {
  const className = "border p-3 text-sm outline-none focus:border-[#111111]";
  return (
    <label className={`grid gap-2 text-sm font-semibold text-[#111111] ${multiline ? "md:col-span-2" : ""}`}>
      {label}
      {multiline ? (
        <textarea className={className} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input required={required} className={className} value={value}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
