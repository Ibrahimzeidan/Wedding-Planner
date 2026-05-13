export default function TypingIndicator() {
  return (
    <div className="mr-auto flex items-center gap-2 rounded-2xl border border-[#111111]/10 bg-event-paper px-4 py-3 text-sm text-stone-600 shadow-sm">
      <span>Planning</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-500 [animation-delay:240ms]" />
      </span>
    </div>
  );
}
