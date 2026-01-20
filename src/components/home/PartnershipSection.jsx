import "../../styles/partnership.css";

export default function PartnershipSection() {
  return (
    <section className="partnership-section">
      {/* Mandala Background */}
      <div className="partnership-bg" />

      <div className="partnership-wrapper">
        {/* LEFT : HANDSHAKE IMAGE */}
        <div className="partnership-image">
          <div className="image-frame">
            <img
              src="/images/partner.jpg"
              alt="Trusted partnership with Mother Dairy"
            />
          </div>
        </div>

        {/* RIGHT : CONTENT */}
        <div className="partnership-content">
          <h2>
            A Partnership Built on{" "}
            <span>Trust, Scale & Standards</span>
          </h2>

          <p>
            Mother Dairy is one of India’s most trusted dairy institutions,
            recognised for its extensive cold-chain network, farmer-first
            procurement model, and disciplined quality assurance systems that
            serve millions of households every day.
          </p>

          <p>
            Kamdhenu Dairy aligns with these institutional standards while
            remaining deeply rooted in India’s heritage of purity and
            nourishment. This partnership reflects a shared commitment to
            consistency, transparency, and responsible sourcing across the
            supply chain.
          </p>

          <p>
            Together, we combine large-scale operational reliability with
            time-honoured values — delivering dairy products that consumers can
            trust without compromise.
          </p>

          <div className="partnership-highlights">
            <span>Pan-India cold-chain discipline</span>
            <span>Institutional quality controls</span>
            <span>Farmer-connected sourcing network</span>
            <span>Reliable & scalable distribution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
