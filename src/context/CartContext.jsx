import { createContext, useContext, useState } from 'react'

const CartContext = createContext([])

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addItem = item => setCart(prev => [...prev, item])
  const removeItem = id => setCart(prev => prev.filter(i => i.id !== id))
  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
