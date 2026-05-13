"use client";

import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";

type Props = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export default function AIInput({ disabled, onSend }: Props) {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    setMessage("");
    onSend(trimmed);
  }

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-[#111111]/10 p-4">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ask for a wedding package, cheaper options, or venues..."
        className="min-w-0 flex-1 rounded-full border border-[#111111]/15 px-4 py-3 text-sm outline-none focus:border-[#111111]"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        title="Send message"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white disabled:bg-stone-300"
      >
        <SendHorizonal className="h-4 w-4" />
      </button>
    </form>
  );
}
