// src/services/authService.js
import api from "../config/api";

export const register = async ({ email, password }) => {
  // Tu endpoint POST /api/auth/register
  return (await api.post("/auth/register", { email, password })).data;
};

export const login = async ({ email, password }) => {
  return (await api.post("/auth/login",    { email, password })).data;
};
