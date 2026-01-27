import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/payment.css";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Invalid payment link");
      setLoading(false);
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      setError("Order not found");
    } else {
      setOrder(data);
    }
    setLoading(false);
  }

  // 🔵 MOCK SUCCESS
  async function handleMockSuccess() {
    setProcessing(true);

    await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        order_status: "CONFIRMED",
        payment_id: "MOCK_PAY_" + Date.now(),
      })
      .eq("id", orderId);

    navigate("/thankyou");
  }

  // 🔴 MOCK FAILURE
  async function handleMockFailure() {
    setProcessing(true);

    await supabase
      .from("orders")
      .update({
        payment_status: "FAILED",
      })
      .eq("id", orderId);

    setProcessing(false);
    alert("Payment failed. You can retry from orders.");
  }

  if (loading) {
    return <div className="payment-loading">Loading payment…</div>;
  }

  if (error) {
    return <div className="payment-error">{error}</div>;
  }

  return (
    <div className="payment-container">
      <h2>Complete Payment</h2>

      <div className="payment-card">
        <div className="payment-row">
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>

        <div className="payment-row">
          <span>Amount</span>
          <strong>₹{order.total_amount}</strong>
        </div>

        <div className="payment-note">
          Secure payment powered by Razorpay
        </div>

        <button
          className="payment-btn success"
          onClick={handleMockSuccess}
          disabled={processing}
        >
          {processing ? "Processing…" : "Pay Now (Mock Success)"}
        </button>

        <button
          className="payment-btn failure"
          onClick={handleMockFailure}
          disabled={processing}
        >
          Simulate Failure
        </button>
      </div>
    </div>
  );
}
