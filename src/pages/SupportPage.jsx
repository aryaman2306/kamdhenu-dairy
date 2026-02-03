import { useState } from "react";

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main style={{ padding: "120px 20px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Support</h1>

      <p style={{ marginBottom: 20, color: "#555" }}>
        Facing an issue? Raise a support request below or contact us directly.
      </p>

      <p style={{ marginBottom: 20 }}>
        📧 <strong>kamdhenudairy@gmail.com</strong><br />
        📞 <strong>+91 9518519569</strong>
      </p>

      {submitted ? (
        <p style={{ color: "green" }}>
          Your request has been submitted. We’ll get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your issue"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{
              width: "100%",
              minHeight: 120,
              padding: 12,
              marginBottom: 16,
            }}
          />

          <button
            type="submit"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: "#ea580c",
              color: "#fff",
              border: "none",
            }}
          >
            Submit Request
          </button>
        </form>
      )}
    </main>
  );
}
