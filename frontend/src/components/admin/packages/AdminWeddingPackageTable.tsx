"use client";

import type { WeddingPackage } from "@/types/packages";

type Props = {
  packages: WeddingPackage[];
  selectedId?: number | null;
  onSelect: (item: WeddingPackage) => void;
  onEdit: (item: WeddingPackage) => void;
  onDelete: (id: number) => void;
  onToggle: (item: WeddingPackage) => void;
};

export default function AdminWeddingPackageTable({ packages, selectedId, onSelect, onEdit, onDelete, onToggle }: Props) {
  return (
    <div className="overflow-x-auto bg-white shadow-soft">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="bg-stone-100 text-xs uppercase text-stone-500">
          <tr><th className="p-3">Package</th><th className="p-3">Price</th><th className="p-3">Guests</th><th className="p-3">Active</th><th className="p-3 text-right">Actions</th></tr>
        </thead>
        <tbody>
          {packages.map((item) => (
            <tr key={item.id} className={`border-t ${selectedId === item.id ? "bg-stone-50" : ""}`}>
              <td className="p-3 font-medium">{item.title}</td>
              <td className="p-3">${Number(item.total_price).toLocaleString()}</td>
              <td className="p-3">{item.guest_capacity || "-"}</td>
              <td className="p-3">{item.is_active ? "Yes" : "No"}</td>
              <td className="space-x-2 p-3 text-right">
                <button onClick={() => onSelect(item)} className="border px-3 py-1">Items</button>
                <button onClick={() => onToggle(item)} className="border px-3 py-1">Toggle</button>
                <button onClick={() => onEdit(item)} className="border px-3 py-1">Edit</button>
                <button onClick={() => onDelete(item.id)} className="bg-[#111111] px-3 py-1 text-white">Delete</button>
              </td>
            </tr>
          ))}
          {!packages.length && <tr><td colSpan={5} className="p-6 text-center text-stone-500">No wedding packages yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
