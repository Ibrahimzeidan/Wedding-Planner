"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, UserCircle } from "lucide-react";

type ProfileImageUploadProps = {
  storageKey: string;
  name: string;
};

export default function ProfileImageUpload({ storageKey, name }: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setImagePreview(localStorage.getItem(storageKey) ?? "");
  }, [storageKey]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result);
      setImagePreview(imageData);
      localStorage.setItem(storageKey, imageData);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-event-paper text-[#111111] shadow-soft ring-1 ring-[#111111]/10 sm:h-32 sm:w-32">
        {imagePreview ? (
          <img src={imagePreview} alt={`${name} profile`} className="h-full w-full object-cover" />
        ) : (
          <UserCircle className="h-16 w-16" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-4 py-2 text-sm font-semibold text-[#111111] transition hover:border-[#111111]"
      >
        <Camera size={16} aria-hidden="true" />
        {imagePreview ? "Change Photo" : "Upload Photo"}
      </button>
    </div>
  );
}
