import { useNavigate } from "react-router-dom";
import "../../styles/hero.css";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="kd-hero">
      {/* Single rotating mandala */}
      <div className="kd-hero-mandala" />

      {/* Inner layout */}
      <div className="kd-hero-inner">
        <div className="kd-hero-content">
          <span className="kd-badge">✨ From the Divine Kamdhenu</span>

          <h1>
            Pure & Divine <br />
            <span>Dairy Blessings</span>
          </h1>

          <p className="kd-hero-text">
            Experience the sacred blessings of Kamdhenu, the wish-fulfilling
            divine cow, through premium dairy rooted in purity and tradition.
          </p>

          <div className="kd-hero-actions">
            <button
              className="kd-btn-primary"
              onClick={() => navigate("/catalog")}
            >
              Explore Products
            </button>

            <button
              className="kd-btn-outline"
              onClick={() => navigate("/about")}
            >
              Our Story
            </button>
          </div>
        </div>

        <div className="kd-hero-image-wrap">
          <img src="/images/hero-bg.jpg" alt="Kamdhenu Dairy" />
        </div>
      </div>
    </section>
  );
}
