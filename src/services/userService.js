
import api from "../config/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token || ""}` };
};

export const getUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`, { headers: authHeader() });
  return data;
};

export const updateUser = async (userId, payload) => {
  const { data } = await api.put(`/users/${userId}`, payload, { headers: authHeader() });
  return data;
};

export const changePassword = async (userId, payload) => {
  const { data } = await api.put(`/users/${userId}/password`, payload, { headers: authHeader() });
  return data;
};
