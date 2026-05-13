type FormFieldProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

export default function FormField({ label, value, onChange, type = "text" }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-4 py-3 outline-none focus:border-[#111111]" />
    </label>
  );
}
