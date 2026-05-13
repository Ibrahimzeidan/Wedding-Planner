type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function AdminSearchBox({
  label = "Search",
  placeholder = "Search by name, email, category, status, date...",
  value,
  onChange,
}: Props) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#111111]/15 bg-white px-4 py-3 outline-none focus:border-[#111111]"
      />
    </label>
  );
}
