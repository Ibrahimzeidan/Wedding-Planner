const prompts = [
  "Recommend wedding package",
  "Find cheaper options",
  "Show premium packages",
  "Add more guests",
  "Show photographers only",
  "Find venues in my location",
];

type Props = {
  disabled?: boolean;
  onPick: (prompt: string) => void;
};

export default function QuickPrompts({ disabled, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onPick(prompt)}
          className="rounded-full border border-[#111111]/15 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-[#111111] disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
