import React from "react";
import { Link } from "react-router-dom";

export default function CartPage({ cart, updateQty }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 && (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/">Go to catalog</Link>
        </div>
      )}
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.img || "https://via.placeholder.com/80"} alt={item.name} />
          <div className="cart-item-info">
            <strong>{item.name}</strong>
            <p>${item.price} each</p>
            <div>
              <label>Qty: </label>
              <input type="number" value={item.qty} min="0" onChange={(e) => updateQty(item.id, Number(e.target.value))} />
            </div>
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="cart-footer">
          <strong>Total: ${total}</strong>
          <Link to="/checkout" className="btn">Proceed to Checkout</Link>
        </div>
      )}
    </div>
  );
}
