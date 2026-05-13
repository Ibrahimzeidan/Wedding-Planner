"use client";

import { Upload } from "lucide-react";

type ProfilePhotoUploadProps = {
  image?: string | null;
  label: string;
  name: string;
  onChange: (image: string) => void;
};

export default function ProfilePhotoUpload({ image, label, name, onChange }: ProfilePhotoUploadProps) {
  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid justify-items-center gap-3">
      <img src={image || "/images/logo.jpeg"} alt={name}
        className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-soft" />
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold">
        {label}
        <Upload className="h-4 w-4" />
        <input type="file" accept="image/*" className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])} />
      </label>
    </div>
  );
}
