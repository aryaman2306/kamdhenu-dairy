import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import MinimalHeader from "../components/layout/MinimalHeader";
import "../styles/checkout.css";

export default function CheckoutPage() {
  const { cartItems, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.id] = acc[item.id] || item.quantity || 1;
      return acc;
    }, {})
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <MinimalHeader />
        <div className="page-with-minimal-header checkout-empty">
          Your cart is empty.
        </div>
      </>
    );
  }

  function handleDecrease(itemId) {
    setQuantities((prev) => {
      const currentQty = prev[itemId];

      // Remove item if qty is 1
      if (currentQty === 1) {
        updateQuantity(itemId, 0);
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }

      return {
        ...prev,
        [itemId]: currentQty - 1,
      };
    });
  }

  function handleIncrease(itemId) {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  }

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + item.price_per_unit * quantities[item.id],
    0
  );

  async function placeOrder() {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);

    try {
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

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        unit: item.unit,
        unit_price: item.price_per_unit,
        quantity: quantities[item.id],
        line_total:
          item.price_per_unit * quantities[item.id],
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (payment === "COD") {
        clearCart();
        navigate("/thankyou");
      } else {
        navigate(`/payment?orderId=${order.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MinimalHeader />

      {/* 👇 EXTRA TOP SPACING FIX */}
      <div className="page-with-minimal-header checkout-page">
        <div className="checkout-container">
          {/* LEFT — CART */}
          <div className="checkout-cart">
            <h2>Your Order</h2>

            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <div>
                  <strong>{item.name}</strong>
                  <div className="checkout-unit">{item.unit}</div>
                </div>

                <div className="checkout-controls">
                  <button onClick={() => handleDecrease(item.id)}>
                    −
                  </button>
                  <span>{quantities[item.id]}</span>
                  <button onClick={() => handleIncrease(item.id)}>
                    +
                  </button>
                </div>

                <div className="checkout-price">
                  ₹{item.price_per_unit * quantities[item.id]}
                </div>
              </div>
            ))}

            <div className="checkout-total">
              Total: ₹{totalAmount}
            </div>
          </div>

          {/* RIGHT — FORM */}
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

            <div className="payment-options">
              <div
                className={`payment-card ${
                  payment === "COD" ? "active" : ""
                }`}
                onClick={() => setPayment("COD")}
              >
                <div className="payment-title">Cash on Delivery</div>
                <div className="payment-desc">
                  Pay when your order arrives
                </div>
              </div>

              <div
                className={`payment-card ${
                  payment === "ONLINE" ? "active" : ""
                }`}
                onClick={() => setPayment("ONLINE")}
              >
                <div className="payment-title">Online Payment</div>
                <div className="payment-desc">
                  UPI, Debit Card, Credit Card
                </div>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="checkout-btn"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
