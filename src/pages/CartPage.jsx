import { useCart } from '../context/CartContext'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useEffect } from 'react'

export default function CartPage() {
  const { cart, removeItem, clearCart } = useCart()

  useEffect(() => {
    initMercadoPago('TEST_PUBLIC_KEY')
  }, [])

  const total = cart.reduce((sum, i) => sum + i.price, 0)

  return (
    <div>
      <h2>Carrito</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => removeItem(item.id)}>Quitar</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <button onClick={clearCart}>Vaciar</button>
      <Wallet initialization={{ preferenceId: 'YOUR_PREFERENCE_ID' }} />
    </div>
  )
}
