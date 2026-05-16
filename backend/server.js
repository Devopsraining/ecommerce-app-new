const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const products = [
  { id: 1, name: "Laptop", price: 900 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Headphones", price: 120 }
];
app.get("/api/products", (req, res) => {
  res.json(products);
});

// In-memory orders storage (for demo only)
const orders = [];
app.use(express.json());

// Create an order (checkout simulation)
app.post("/api/orders", (req, res) => {
  const order = req.body;
  if (!order || !order.items || order.items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }
  order.id = orders.length + 1;
  order.createdAt = new Date().toISOString();
  orders.push(order);
  res.status(201).json({ orderId: order.id });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
