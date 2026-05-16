import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Confirm() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId");
  return (
    <div className="confirm">
      <h2>Order Confirmed</h2>
      <p>Thank you! Your order {orderId ? `#${orderId}` : "was received"}.</p>
      <Link to="/">Back to catalog</Link>
    </div>
  );
}
