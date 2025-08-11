import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";

const STORAGE_KEY = "cart_items_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
        console.error("Error loading cart items from localStorage");
        setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        console.error("Error saving cart items to localStorage");
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(v => !v);

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(999, next[idx].qty + qty) };
        return next;
      }
      return [{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, qty }, ...prev];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, Math.min(999, qty || 1)) } : p));
  }, []);

  const inc = useCallback((id) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.min(999, p.qty + 1) } : p)), []);
  const dec = useCallback((id) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p)), []);
  const removeItem = useCallback((id) => setItems(prev => prev.filter(p => p.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.qty * (Number(i.price) || 0), 0), [items]);

  const value = {
    items, addItem, setQty, inc, dec, removeItem, clearCart,
    totalQty, totalPrice,
    isOpen, openCart, closeCart, toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
