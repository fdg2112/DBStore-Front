import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Main.css";
import { getProducts } from "../../services/productService";
import esferaOn from "../../assets/esfera_favorito_activado.png";
import esferaOff from "../../assets/esfera_favorito_desactivado.png";

const FAVORITES_KEY = "favoriteIds";

const Main = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [favIds, setFavIds] = useState(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setFavIds(new Set(stored));
  }, []);

  const saveFavs = (setLike) => {
    const arr = Array.from(setLike);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
  };

  const toggleFav = (id) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavs(next);
      return next;
    });
  };

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

  useEffect(() => { fetchProducts(); }, []);

  const query = (new URLSearchParams(location.search).get("q") || "").trim().toLowerCase();
  useEffect(() => { setCurrentPage(1); }, [query]);

  const filtered = query
    ? products.filter(p =>
        (p.name || "").toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query)
      )
    : products;

  const totalPages = Math.ceil(filtered.length / productsPerPage) || 1;
  const firstIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filtered.slice(firstIndex, firstIndex + productsPerPage);
  const fillerCount = productsPerPage - currentProducts.length;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="main">
      <div className="main-header banner"></div>
      <div className="main-content">
        {error   && <p className="error">{error}</p>}
        {loading && <p className="loading">Cargando productos… Son servicios gratuitos de alojamiento... Paciencia por favor je</p>}
        {!loading && filtered.length === 0 && (
          <p className="error">No encontramos productos para “{query}”.</p>
        )}
        {!loading && (
          <>
            <ul className="product-list">
              {currentProducts.map(product => {
                const isFav = favIds.has(product.id);
                return (
                  <li key={product.id} className="product-item">
                    <button
                      className={`fav-toggle ${isFav ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFav(product.id);
                      }}
                      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                      title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <img src={isFav ? esferaOn : esferaOff} alt="" />
                    </button>

                    <Link to={`/products/${product.id}`} className="product-link-wrapper">
                      <div className="product-img-container">
                        <img src={product.imageUrl} alt={product.name} />
                      </div>
                      <h2 className="product-name">{product.name}</h2>
                      <p className="product-price">Precio: ${product.price}</p>
                    </Link>

                    <div className="card-actions">
                      <button
                        className="btn-buy-now"
                        onClick={() => {
                          // TODO: lógica de compra inmediata
                          console.log("Comprar ahora:", product.id);
                        }}
                      >
                        Comprar ahora
                      </button>
                      <button
                        className="btn-add-cart"
                        onClick={() => {
                          // TODO: lógica de añadir al carrito
                          console.log("Añadir al carrito:", product.id);
                        }}
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </li>
                );
              })}
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
