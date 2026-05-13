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
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
