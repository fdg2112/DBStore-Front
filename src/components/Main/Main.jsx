// src/components/Main.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { getProducts } from "../../services/productService";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los productos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="main">
      <div className="main-header banner">
        {/* tu banner aquí */}
      </div>
      <div className="main-content">
        {error   && <p className="error">{error}</p>}
        {loading && <p>Cargando productos... Tené paciencia porfa porque uso servicios gratuitos xD</p>}
        {!loading && (
          <ul className="product-list">
            {products.map(product => (
              <li key={product.id} className="product-item">
                <div className="product-img-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </div>
                <h2>{product.name}</h2>
                <p className="product-price">Precio: ${product.price}</p>
                <div className="card-buttons">
                  <button className="add-to-cart">Añadir al carrito</button>
                  <Link
                    to={`/products/${product.id}`}
                    className="view-details"
                  >
                    Ver detalles
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Main;
