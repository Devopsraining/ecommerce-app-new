import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout({ cart, clearCart }) {
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty");
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: form })
      });
      const data = await resp.json();
      if (resp.ok) {
        clearCart();
        navigate(`/confirm?orderId=${data.orderId}`);
      } else {
        alert(data.error || "Failed to create order");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={submit} className="checkout-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handle} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handle} required />
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handle} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? "Placing order..." : "Place Order"}</button>
      </form>
    </div>
  );
}
