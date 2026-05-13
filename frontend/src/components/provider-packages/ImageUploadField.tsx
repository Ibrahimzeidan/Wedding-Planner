"use client";

import { Upload } from "lucide-react";

type Props = {
  image?: string | null;
  onChange: (image: string) => void;
};

export default function ImageUploadField({ image, onChange }: Props) {
  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2 md:col-span-2">
      <span className="text-sm font-semibold text-[#111111]">Package Image</span>
      <div className="flex flex-wrap items-center gap-4">
        {image && <img src={image} alt="Package preview" className="h-24 w-32 rounded-lg object-cover" />}
        <label className="inline-flex cursor-pointer items-center gap-2 border px-4 py-3 text-sm font-semibold">
          Upload from device
          <Upload className="h-4 w-4" />
          <input type="file" accept="image/*" className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}
