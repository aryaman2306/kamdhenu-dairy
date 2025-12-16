export default function FABs() {
  const phone = "919812345678"; // change later if needed

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 999,
      }}
    >
      <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
        <div style={fabStyle("#25D366")}>💬</div>
      </a>

      <a href={`tel:+${phone}`}>
        <div style={fabStyle("#fff")}>📞</div>
      </a>

      <button
        onClick={() =>
          document
            .getElementById("products-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={fabStyle("#c2410c", true)}
      >
        🛒
      </button>
    </div>
  );
}

function fabStyle(bg, dark) {
  return {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: bg,
    color: dark ? "#fff" : "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    boxShadow: "0 8px 22px rgba(0,0,0,.18)",
    border: bg === "#fff" ? "1px solid #ddd" : "none",
  };
}
