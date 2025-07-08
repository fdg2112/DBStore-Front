import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../services/api'

export default function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    apiFetch('/products').then(setProducts).catch(() => {})
  }, [])

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <Link to={`/producto/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
