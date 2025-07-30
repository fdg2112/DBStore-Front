// src/views/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import "../styles/ProductDetails.css";
import { db } from "../config/Firebase";
import { doc, getDoc } from "firebase/firestore";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // → Traer el documento desde Firestore
        const docRef = doc(db, "products", id);
        const snap   = await getDoc(docRef);
        if (!snap.exists()) {
          throw new Error("Producto no encontrado");
        }
        setProduct({ id: snap.id, ...snap.data() });
      } catch (err) {
        setError(
          "Ups! No se pudo cargar el producto. Algo falló, aquí el detalle: " +
            err.message
        );
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <section className="productDetails">
      <Layout>
        {error && <p className="pd-error">{error}</p>}
        {!product && !error && <p>Cargando producto...</p>}
        {product && (
          <div className="product-card">
            <div className="pd-col pd-image-col">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="pd-col pd-info-col">
              <h2>{product.title}</h2>
              <h3>${product.price}</h3>
              <p>{product.description}</p>
              <p>SKU {product.sku}</p>
              <div className="pd-extra">
                <p className="pd-installments">
                  Mismo precio en 3 cuotas de ${(product.price / 3).toFixed(2)}
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
