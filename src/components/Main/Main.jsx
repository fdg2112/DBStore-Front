import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { db } from "../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const productsCol = collection(db, "products");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(productsCol);
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
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

        </div>
        <div className="main-content">
          {error && <p className="error">{error}</p>}
          {loading && <p>Cargando productos...</p>}
          {!loading && (
            <ul className="product-list">
              {products.map(product => (
                <li key={product.id} className="product-item">
                  <div className="product-img-container">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <h2>{product.title}</h2>
                  <p className="product-price">Precio: ${product.price}</p>
                  <p className="product-sku">SKU {product.sku}</p>
                  <div className="card-buttons">
                    <button className="add-to-cart">Añadir al carrito</button>
                    <Link to={`/products/${product.id}`} className="view-details">
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
}

export default Main;