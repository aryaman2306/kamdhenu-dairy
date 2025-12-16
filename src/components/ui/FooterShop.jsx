export default function FooterShop() {
  return (
    <footer
      style={{
        marginTop: 32,
        padding: "24px 12px",
        borderTop: "1px solid #eee",
        background: "#fffdf9",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <strong>Kamdhenu Dairy</strong>
        <div style={{ marginTop: 6 }}>
          Fresh milk & dairy products • Pune
        </div>
        <div style={{ marginTop: 6 }}>
          ⏰ Open daily: 6 AM – 10 PM
        </div>
        <div style={{ marginTop: 6 }}>
          📍 <a href="https://maps.google.com/?q=kamdhenu+dairy+pune">Open in Maps</a>
        </div>
      </div>
    </footer>
  );
}
