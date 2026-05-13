"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-[#111111]/10 pt-3">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a message"
        className="min-w-0 flex-1 border border-[#111111]/15 px-3 py-2 text-sm outline-none focus:border-[#111111]"
      />
      <button className="bg-[#111111] px-4 py-2 text-sm font-semibold text-white">Send Message</button>
    </form>
  );
}
