import { useEffect, useState } from "react";

export default function KamdhenuHero() {
  const slides = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        padding: "2.5rem 1rem",
        background: "linear-gradient(#fffaf0,#fff)",
        borderBottom: "1px solid #f1e6dc",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src="/images/cow-icon.png"
              alt="Kamdhenu"
              style={{ width: 64 }}
            />
            <div>
              <h1 style={{ margin: 0 }}>Kamdhenu Dairy</h1>
              <div style={{ color: "#7b5e57", fontSize: 14 }}>
                शुद्ध दुग्ध • Fresh Dairy Products
              </div>
            </div>
          </div>

          <p style={{ marginTop: 16, color: "#4b3b36" }}>
            Fresh cow & buffalo milk, A2 milk, paneer, curd and lassi —
            delivered fresh from our dairy every day.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("products-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              marginTop: 16,
              padding: "10px 16px",
              background: "#c2410c",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Order Fresh Milk 🥛
          </button>
        </div>

        {/* RIGHT CAROUSEL */}
        <div
          style={{
            overflow: "hidden",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              transform: `translateX(-${index * 100}%)`,
              transition: "transform .6s ease",
            }}
          >
            {slides.map((s, i) => (
              <img
                key={i}
                src={s}
                alt="dairy"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
              />
            ))}
          </div>

          <img
            src="/images/cow-sticker.png"
            alt="cow"
            style={{
              position: "absolute",
              bottom: -10,
              left: 10,
              width: 120,
              animation: "float 3s ease-in-out infinite",
            }}
          />

          <style>{`
            @keyframes float {
              0%{transform:translateY(0)}
              50%{transform:translateY(-8px)}
              100%{transform:translateY(0)}
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
