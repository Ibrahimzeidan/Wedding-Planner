"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import FavoritesTable from "@/components/admin/favorites/FavoritesTable";
import { deleteAdminFavorite, getAdminFavorites } from "@/lib/favoritesApi";
import { matchesAdminSearch } from "@/lib/adminSearch";
import type { Favorite } from "@/types/favorite";

export default function AdminFavoritesManager() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminFavorites()
      .then(setFavorites)
      .catch((error) => setMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);
  const shown = useMemo(
    () => favorites.filter((favorite) => matchesAdminSearch(favorite, search)),
    [favorites, search],
  );

  async function remove(favorite: Favorite) {
    if (!window.confirm(`Delete favorite for ${favorite.provider_name}?`)) return;
    try {
      await deleteAdminFavorite(favorite.id);
      setFavorites((items) => items.filter((item) => item.id !== favorite.id));
      setMessage("Favorite deleted.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <AdminLayout title="Favorites" description="View and remove customer saved provider favorites.">
      {message && <p className="mb-4 bg-white p-3 text-sm text-stone-700 shadow-soft">{message}</p>}
      <div className="mb-4 border border-[#111111]/10 bg-white p-5 shadow-soft">
        <AdminSearchBox value={search} onChange={setSearch}
          placeholder="Search favorites by customer, provider, package, category, location..." />
      </div>
      {isLoading ? (
        <p className="text-sm text-stone-600">Loading favorites...</p>
      ) : (
        <FavoritesTable favorites={shown} onDelete={remove} />
      )}
    </AdminLayout>
  );
}
