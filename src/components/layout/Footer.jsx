import { Link } from "react-router-dom";
import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="kd-footer">
      <div className="kd-footer-inner">

        {/* BRAND */}
        <div className="kd-footer-brand">
          <img
            src="/images/cow-icon.png"
            alt="Kamdhenu Dairy"
            className="kd-footer-logo"
          />
          <h3>कामधेनु Kamdhenu</h3>
          <p>
            Sacred nourishment inspired by Indian tradition,
            delivering purity, trust, and care in every drop.
          </p>
        </div>

        {/* LINKS */}
        <div className="kd-footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/catalog">Products</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* SUPPORT */}
        <div className="kd-footer-links">
          <h4>Support</h4>
          <a href="tel:+919518519569">+91 9518519569</a>
          <a href="mailto:kamdhenudairy@gmail.com">
            kamdhenudairy@gmail.com
          </a>
          <span className="kd-footer-note">
            Serving locally with care
          </span>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="kd-footer-bottom">
        <span>
          © {new Date().getFullYear()} Kamdhenu Dairy. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
