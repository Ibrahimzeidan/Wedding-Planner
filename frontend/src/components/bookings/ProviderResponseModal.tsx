"use client";

import { FormEvent, useState } from "react";

type Props = {
  title: string;
  actionLabel: string;
  onClose: () => void;
  onSubmit: (note: string) => void;
};

export default function ProviderResponseModal({ title, actionLabel, onClose, onSubmit }: Props) {
  const [note, setNote] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(note.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-md bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add an optional response note"
          className="mt-4 min-h-28 w-full rounded-md border border-[#111111]/15 px-3 py-2 text-sm"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
            {actionLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
