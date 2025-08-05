// src/context/UserProvider.jsx
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

// Función ultra-ligera para decodificar el payload de un JWT
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserData(null);
      return;
    }
    const payload = parseJwt(token);
    if (!payload) {
      setUserData(null);
      return;
    }
    // Tu backend emite 'sub' (user id), 'email' y uno o varios 'role' o 'roles'
    const roles = payload.roles ?? (payload.role ? [payload.role] : []);
    setUserData({
      id:    payload.sub,
      email: payload.email,
      roles
    });
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
