import api from "../config/api";

export const getFavorites = async (userId) => {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/users/${userId}/Favorites`, {
    headers: { Authorization: `Bearer ${token || ""}` }
  });
  return data;
};

export const addFavorite = async (userId, productId) => {
  const token = localStorage.getItem("token");
  const { data } = await api.post(`/users/${userId}/Favorites/${productId}`, null, {
    headers: { Authorization: `Bearer ${token || ""}` }
  });
  return data;
};

/* Si tu API también soporta DELETE, dejá esto. Si NO, decime si el POST hace toggle y lo ajusto. */
export const removeFavorite = async (userId, productId) => {
  const token = localStorage.getItem("token");
  const { data } = await api.delete(`/users/${userId}/Favorites/${productId}`, {
    headers: { Authorization: `Bearer ${token || ""}` }
  });
  return data;
};
