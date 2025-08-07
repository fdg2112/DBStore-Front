import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import "../styles/ProductDetails.css";
import { getProductById } from "../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct]     = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [quantity, setQuantity]   = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const p = await getProductById(id);
        setProduct(p);
      } catch (err) {
        setError("Ups! No se pudo cargar el producto. Detalle: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <section className="productDetails">
      <Layout>
        {error   && <p className="pd-error">{error}</p>}
        {loading && <p className="pd-loading">Cargando producto…</p>}
        {product && (
          <div className="product-card">
            <div className="pd-image-col">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="pd-info-col">
              <h2 className="pd-title">{product.name}</h2>
              <h3 className="pd-price">${product.price}</h3>
              <p className="pd-description">{product.description}</p>
              <p className="pd-stock">Stock: {product.stock}</p>
              <div className="pd-extra">
                <p className="pd-installments">
                  Mismo precio en 3 cuotas de ${(product.price/3).toFixed(2)}
                </p>
                <p className="pd-subtext">o en cuotas sin tarjeta</p>
                <p className="pd-link">
                  <a href="#">Ver los medios de pago</a>
                </p>
                <p className="pd-installments">Llega gratis mañana</p>
                <p className="pd-subtext">
                  Comprando dentro de las próximas 12 h 36 min
                </p>
                <p className="pd-link">
                  <a href="#">Más formas de entrega</a>
                </p>
                <p className="pd-installments">Devolución gratis</p>
                <p className="pd-subtext">
                  Tenés 30 días desde que lo recibís.
                </p>
                <p className="pd-link">
                  <a href="#">Conocer más</a>
                </p>
              </div>
              <div className="pd-quantity">
                <label htmlFor="quantityInput">Cantidad:</label>
                <input
                  id="quantityInput"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={e => {
                    const v = Number(e.target.value);
                    if (v >= 1 && v <= product.stock) setQuantity(v);
                  }}
                  className="pd-quantity-input"
                />
              </div>
              <div className="pd-actions">
                <button className="btn-buy">Comprar ahora</button>
                <button className="btn-add">Añadir al carrito</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </section>
);

};

export default ProductDetails;
