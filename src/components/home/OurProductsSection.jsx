import { useNavigate } from "react-router-dom";
import "../../styles/our-products.css";

export default function OurProductsSection() {
  const navigate = useNavigate();

  const products = [
    {
      title: "Mother Dairy Ice Creams",
      description:
        "Indulgent flavours crafted with purity, joy, and trusted dairy excellence.",
      image: "/images/products/card-icecream.png",
      target: "/catalog#icecream",
    },
    {
      title: "Mother Dairy Milk & Products",
      description:
        "Everyday essentials delivering freshness, nutrition, and consistency.",
      image: "/images/products/card-milk.png",
      target: "/catalog#milk",
    },
    {
      title: "Kamdhenu Fresh & Sacred Range",
      description:
        "Locally sourced fresh dairy and sacred offerings for daily rituals.",
      image: "/images/products/card-other-products.png",
      target: "/catalog#fresh",
    },
  ];

  return (
    <section className="our-products-section">
      <div className="our-products-header">
        <h2>Our Products</h2>
        <p>
          A carefully curated range rooted in purity, tradition, and trust.
        </p>
      </div>

      <div className="our-products-grid">
        {products.map((item) => (
          <div
            key={item.title}
            className="our-product-card"
            onClick={() => navigate(item.target)}
          >
            <div className="our-product-image">
              <img src={item.image} alt={item.title} />
              <span className="card-icon">＋</span>
            </div>

            <div className="our-product-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="explore-link">Explore Range →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
