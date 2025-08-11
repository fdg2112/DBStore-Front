import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../services/favoritesService";
import { UserContext } from "./UserContext";
import { FavoritesContext } from "./FavoritesContext";

export function FavoritesProvider({ children }) {
  const { userData } = useContext(UserContext);
  const userId = userData?.id;
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!userId) { setFavorites([]); return; }
    setLoadingFavs(true);
    try {
      const data = await getFavorites(userId);
      setFavorites(Array.isArray(data) ? data : []);
    } catch {
      setFavorites([]);
    } finally {
      setLoadingFavs(false);
    }
  }, [userId]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const ids = useMemo(() => new Set(favorites.map(f => f.id ?? f.productId)), [favorites]);
  const isFavorite = useCallback((productId) => ids.has(productId), [ids]);

  const toggleFavorite = useCallback(async (product) => {
    if (!userId) return false;
    const id = product.id;
    if (ids.has(id)) {
      setFavorites(prev => prev.filter(p => (p.id ?? p.productId) !== id));
      try { await removeFavorite(userId, id); } catch { loadFavorites(); }
      return true;
    } else {
      setFavorites(prev => [{ ...product }, ...prev]);
      try { await addFavorite(userId, id); } catch { loadFavorites(); }
      return true;
    }
  }, [userId, ids, loadFavorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, loadingFavs, loadFavorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
