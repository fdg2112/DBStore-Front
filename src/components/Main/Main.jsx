import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import { getProducts } from "../../services/productService";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      setError("No se pudieron cargar los productos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lastIndex       = currentPage * productsPerPage;
  const firstIndex      = lastIndex - productsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages      = Math.ceil(products.length / productsPerPage);
  const pageNumbers     = Array.from({ length: totalPages }, (_, i) => i + 1);
  const fillerCount     = productsPerPage - currentProducts.length;

  return (
    <main className="main">
      <div className="main-header banner"></div>
      <div className="main-content">
        {error    && <p className="error">{error}</p>}
        {loading  && <p className="loading">Cargando productos… Son servicios gratuitos de alojamiento... Paciencia por favor je</p>}
        {!loading && (
          <>
            <ul className="product-list">
              {currentProducts.map(product => (
                <li key={product.id} className="product-item">
                  <Link to={`/products/${product.id}`} className="product-link-wrapper">
                    <div className="product-img-container">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-price">Precio: ${product.price}</p>
                  </Link>
                  <button className="add-to-cart" onClick={() => {}}>
                    Añadir al carrito
                  </button>
                </li>
              ))}
              {fillerCount > 0 && Array.from({ length: fillerCount }).map((_, i) => (
                <li key={`filler-${i}`} className="product-item placeholder"></li>
              ))}
            </ul>
            <div className="pagination">
              {pageNumbers.map(num => (
                <button
                  key={num}
                  className={`pagination-button${num === currentPage ? " active" : ""}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                &gt;&gt;
              </button>
            </div>
          </>
        )}
      </div>
    </main>
);

};

export default Main;
