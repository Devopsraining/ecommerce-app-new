import React from "react";
import "./App.css";
function App() {
  const products = [
    { id: 1, name: "Laptop", price: "$900", img: "https://via.placeholder.com/200" },
    { id: 2, name: "Phone", price: "$500", img: "https://via.placeholder.com/200" },
    { id: 3, name: "Headphones", price: "$120", img: "https://via.placeholder.com/200" },
    { id: 4, name: "Smart Watch", price: "$200", img: "https://via.placeholder.com/200" }
  ];
  return (
    <div>
      <header className="header">
        <h1>My Ecommerce Store</h1>
      </header>
      <div className="products">
        {products.map((p) => (
          <div key={p.id} className="card">
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
