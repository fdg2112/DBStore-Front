import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    apiFetch(`/products/${id}`).then(setProduct).catch(() => {})
  }, [id])

  if (!product) return <p>Cargando...</p>

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <button onClick={() => addItem(product)}>Agregar al carrito</button>
    </div>
  )
}
