import { Link } from "react-router-dom";
import "./Header.css";

export default function MinimalHeader() {
  return (
    <header className="kd-header minimal">
      <Link to="/" className="kd-logo">
        <img
          src="/images/cow-icon.png"
          alt="Kamdhenu"
          className="kd-logo-img"
        />

        <div className="kd-logo-text">
          <div className="kd-logo-title">
            कामधेनु Kamdhenu
          </div>
          <div className="kd-logo-sub">
            Sacred Blessings
          </div>
        </div>
      </Link>
    </header>
  );
}
