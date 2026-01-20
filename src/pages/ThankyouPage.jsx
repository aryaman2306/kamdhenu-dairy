import { Link } from "react-router-dom";

export default function ThankYouPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: 32 }}>🙏 Thank You</h1>

        <p style={{ marginTop: 12, fontSize: 16 }}>
          Your order has been placed successfully.
        </p>

        <p style={{ marginTop: 8, color: "#555" }}>
          Our team will contact you shortly to confirm delivery.
        </p>

        <Link to="/">
          <button
            style={{
              marginTop: 24,
              padding: "12px 20px",
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
