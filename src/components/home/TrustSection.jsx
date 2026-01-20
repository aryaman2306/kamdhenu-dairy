import { Flower2, Heart, Award, Leaf } from "lucide-react";
import "../../styles/trust.css";

export default function TrustSection() {
  const trustPoints = [
    {
      icon: <Flower2 />,
      title: "Divine Heritage",
      description:
        "Inspired by Kamdhenu, the sacred wish-fulfilling cow of Hindu tradition",
    },
    {
      icon: <Heart />,
      title: "Pure & Natural",
      description:
        "Made with love and care, using only the finest natural ingredients",
    },
    {
      icon: <Award />,
      title: "Quality Assured",
      description:
        "Certified premium quality products that meet the highest standards",
    },
    {
      icon: <Leaf />,
      title: "Farm Fresh",
      description:
        "Sourced directly from sustainable and ethical dairy farms",
    },
  ];

  return (
    <section className="trust-section">
      {/* QUOTE / HERO STRIP */}
      <div className="trust-hero">
        <h2 className="trust-sanskrit">गावो विश्वस्य मातरः</h2>
        <p className="trust-english">
          Cows are the mothers of the universe
        </p>
      </div>

      {/* TRUST CARDS */}
      <div className="trust-container">
        {trustPoints.map((item) => (
          <div className="trust-card" key={item.title}>
            <div className="trust-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
