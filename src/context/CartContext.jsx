import { createContext, useContext } from "react";

export const CartContext = createContext(null);

// Útil para consumir sin importar useContext en cada componente
export const useCart = () => useContext(CartContext);
