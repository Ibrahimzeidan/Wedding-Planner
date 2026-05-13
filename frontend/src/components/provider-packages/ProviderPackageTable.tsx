"use client";

import type { ProviderPackage } from "@/types/packages";

type Props = {
  packages: ProviderPackage[];
  onEdit: (item: ProviderPackage) => void;
  onDelete: (id: number) => void;
  onToggle: (item: ProviderPackage) => void;
};

export default function ProviderPackageTable({ packages, onEdit, onDelete, onToggle }: Props) {
  if (!packages.length) {
    return <div className="bg-white p-8 text-center text-sm text-stone-600 shadow-soft">No packages yet.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-soft">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-stone-100 text-xs uppercase text-stone-500">
          <tr>
            <th className="p-3">Package</th>
            <th className="p-3">Price</th>
            <th className="p-3">Capacity</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3 font-medium">{item.title}</td>
              <td className="p-3">${Number(item.price ?? 0).toLocaleString()}</td>
              <td className="p-3">{item.capacity || "-"}</td>
              <td className="p-3">{item.is_available ? "Available" : "Unavailable"}</td>
              <td className="space-x-2 p-3 text-right">
                <button onClick={() => onToggle(item)} className="border px-3 py-1">Toggle</button>
                <button onClick={() => onEdit(item)} className="border px-3 py-1">Edit</button>
                <button onClick={() => onDelete(item.id)} className="bg-[#111111] px-3 py-1 text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
