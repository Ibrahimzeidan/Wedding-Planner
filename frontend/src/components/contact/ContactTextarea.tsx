type ContactTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ContactTextarea({ value, onChange }: ContactTextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      Message
      <textarea
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="How can we help with your wedding plans?"
        required
        className="min-h-36 w-full min-w-0 resize-y border border-[#111111]/15 bg-transparent px-4 py-3 text-[#111111] outline-none transition placeholder:text-stone-400 focus:border-[#111111]"
      />
    </label>
  );
}
