import React from "react";

export default function ProductList({ products, addToCart }) {
  return (
    <div className="products">
      {products.map((p) => (
        <div key={p.id} className="card">
          <img src={p.img || "https://via.placeholder.com/200"} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
