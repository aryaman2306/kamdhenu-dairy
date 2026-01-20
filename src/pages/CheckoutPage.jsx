import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function CheckoutPage() {
  const { items, setItemQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return <div className="checkout-empty">Your cart is empty.</div>;
  }

  async function placeOrder() {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create order
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          total_amount: totalAmount,
          payment_method: payment,
          order_status: "PENDING",
          payment_status: payment === "COD" ? "UNPAID" : "PENDING",
        })
        .select()
        .single();

      if (error) throw error;

      // 2️⃣ Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        unit: item.unit,
        unit_price: item.pricePerUnit,
        quantity: item.quantity,
        line_total: item.pricePerUnit * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();

      // 3️⃣ Redirect
      if (payment === "COD") {
        navigate("/thankyou");
      } else {
        navigate("/payment");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-container">
      {/* LEFT SIDE — CART */}
      <div className="checkout-cart">
        <h2>Your Order</h2>

        {items.map((item) => (
          <div key={item.productId} className="checkout-item">
            <div>
              <strong>{item.name}</strong>
              <div className="checkout-unit">{item.unit}</div>
            </div>

            <div className="checkout-controls">
              <button
                onClick={() =>
                  setItemQuantity(item, item.quantity - 1)
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  setItemQuantity(item, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <div className="checkout-price">
              ₹{item.pricePerUnit * item.quantity}
            </div>
          </div>
        ))}

        <div className="checkout-total">
          Total: ₹{totalAmount}
        </div>
      </div>

      {/* RIGHT SIDE — FORM */}
      <div className="checkout-form">
        <h2>Delivery Details</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
          maxLength={10}
        />

        <textarea
          placeholder="Delivery Address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h3>Payment Method</h3>

        <label className="payment-option">
          <input
            type="radio"
            value="COD"
            checked={payment === "COD"}
            onChange={() => setPayment("COD")}
          />
          Cash on Delivery
        </label>

        <label className="payment-option">
          <input
            type="radio"
            value="ONLINE"
            checked={payment === "ONLINE"}
            onChange={() => setPayment("ONLINE")}
          />
          Online Payment (UPI / Card)
        </label>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="checkout-btn"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
