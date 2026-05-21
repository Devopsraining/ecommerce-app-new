const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://ecommerce_user:ecommerce_password@localhost:5432/ecommerce_db"
});

// Test database connection
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get all orders with items
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.created_at, json_agg(
        json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)
      ) as items 
      FROM orders o 
      LEFT JOIN order_items oi ON o.id = oi.order_id 
      LEFT JOIN products p ON oi.product_id = p.id 
      GROUP BY o.id, o.created_at
      ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create an order
app.post("/api/orders", async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    // Start transaction
    await client.query("BEGIN");

    // Insert order
    const orderResult = await client.query(
      "INSERT INTO orders DEFAULT VALUES RETURNING id"
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.id, item.quantity, item.price]
      );
    }

    // Commit transaction
    await client.query("COMMIT");
    res.status(201).json({ orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
  console.log("Database URL:", process.env.DATABASE_URL || "postgresql://localhost:5432/ecommerce_db");
});
