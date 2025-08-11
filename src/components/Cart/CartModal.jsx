import { useContext, useEffect, useRef } from "react";
import "./CartModal.css";
import { CartContext } from "../../context/CartContext";

const CartModal = () => {
  const { isOpen, closeCart, items, inc, dec, setQty, removeItem, clearCart, totalQty, totalPrice } = useContext(CartContext);
  const boxRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()} ref={boxRef}>
        <div className="cart-header">
          <h3>Tu Carrito</h3>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">Todavía no agregaste productos.</div>
        ) : (
          <ul className="cart-list">
            {items.map(item => (
              <li className="cart-row" key={item.id}>
                <img className="cart-thumb" src={item.imageUrl} alt={item.name} />
                <div className="cart-info">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-price">${Number(item.price).toFixed(2)}</div>
                </div>
                <div className="cart-qty">
                  <button onClick={() => dec(item.id)} aria-label="menos">–</button>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={item.qty}
                    onChange={(e) => setQty(item.id, Number(e.target.value))}
                  />
                  <button onClick={() => inc(item.id)} aria-label="más">+</button>
                </div>
                <div className="cart-subtotal">${(Number(item.price) * item.qty).toFixed(2)}</div>
                <button className="cart-remove" onClick={() => removeItem(item.id)} aria-label="Quitar">🗑️</button>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-footer">
          <div className="cart-totals">
            <span>{totalQty} ítem(s)</span>
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>
          <div className="cart-actions">
            <button className="btn-clear" onClick={clearCart} disabled={items.length === 0}>Vaciar</button>
            <button className="btn-checkout" onClick={() => alert("Ir a checkout (por implementar)")}>Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
