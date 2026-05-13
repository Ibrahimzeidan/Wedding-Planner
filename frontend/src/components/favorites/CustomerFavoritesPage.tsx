"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FavoritesGrid from "@/components/favorites/FavoritesGrid";
import { getFavorites } from "@/lib/favoritesApi";
import type { Favorite } from "@/types/favorite";

export default function CustomerFavoritesPage() {
  return (
    <ProtectedRoute allowedRole="customer">
      {() => <FavoritesBody />}
    </ProtectedRoute>
  );
}

function FavoritesBody() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((error) => setMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  function handleRemoved(favoriteId: number) {
    setFavorites((items) => items.filter((item) => item.id !== favoriteId));
    setMessage("Favorite removed.");
  }

  return (
    <main className="min-h-screen bg-[#efefef] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 border border-[#111111]/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase text-stone-500">Customer dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111111]">Favorites</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Review saved providers and wedding packages in one place.
          </p>
        </div>
        {message && <p className="mb-4 bg-white p-3 text-sm text-stone-700 shadow-soft">{message}</p>}
        {isLoading ? (
          <p className="text-sm text-stone-600">Loading favorites...</p>
        ) : (
          <FavoritesGrid favorites={favorites} onRemoved={handleRemoved} />
        )}
      </section>
    </main>
  );
}
