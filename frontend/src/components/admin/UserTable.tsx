import { getRoleLabel } from "@/lib/auth";
import type { AdminUser } from "@/types/admin";

type UserTableProps = {
  users: AdminUser[];
  onDelete: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
};

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#111111]/10 text-sm">
          <thead className="bg-event-paper text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Full name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {users.map((user) => (
              <tr key={user.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">{user.full_name}</td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-event-paper px-3 py-1 text-xs font-semibold text-[#111111]">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-4 py-4">{user.is_active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(user)} className="rounded-full border px-3 py-1 font-semibold">
                      Edit
                    </button>
                    <button onClick={() => onDelete(user)} className="rounded-full bg-red-600 px-3 py-1 font-semibold text-white">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!users.length && <p className="px-4 py-6 text-sm text-stone-500">No users found.</p>}
    </div>
  );
}
