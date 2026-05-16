import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/ProductList";
import CartPage from "./components/Cart";
import Checkout from "./components/Checkout";
import Confirm from "./components/Confirm";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {
        // fallback: small static list
        setProducts([
          { id: 1, name: "Laptop", price: 900, img: "https://via.placeholder.com/200" },
          { id: 2, name: "Phone", price: 500, img: "https://via.placeholder.com/200" },
          { id: 3, name: "Headphones", price: 120, img: "https://via.placeholder.com/200" }
        ]);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) {
        return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...c, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0));
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <div>
        <header className="header">
          <h1>My Ecommerce Store</h1>
          <nav className="nav">
            <Link to="/">Catalog</Link>
            <Link to="/cart">Cart ({cart.reduce((s, i) => s + i.qty, 0)})</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProductList products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQty={updateQty} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/confirm" element={<Confirm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
