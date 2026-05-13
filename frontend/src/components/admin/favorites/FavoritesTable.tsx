import type { Favorite } from "@/types/favorite";

type Props = {
  favorites: Favorite[];
  onDelete: (favorite: Favorite) => void;
};

export default function FavoritesTable({ favorites, onDelete }: Props) {
  return (
    <div className="overflow-hidden border border-[#111111]/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#111111]/10 text-sm">
          <thead className="bg-event-paper text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Favorite</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111111]/10">
            {favorites.map((favorite) => (
              <tr key={favorite.id} className="text-stone-700">
                <td className="px-4 py-4 font-semibold text-[#111111]">
                  {favorite.customer_name || `Customer #${favorite.customer_id}`}
                </td>
                <td className="px-4 py-4 capitalize">{favorite.favorite_type}</td>
                <td className="px-4 py-4">{favorite.provider_name || favorite.package_title}</td>
                <td className="px-4 py-4">{favorite.category_name}</td>
                <td className="px-4 py-4">{favorite.location || "-"}</td>
                <td className="px-4 py-4">{new Date(favorite.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => onDelete(favorite)}
                    className="rounded-full bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!favorites.length && <p className="px-4 py-6 text-sm text-stone-500">No favorites found.</p>}
    </div>
  );
}
