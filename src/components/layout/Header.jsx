import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, User } from "lucide-react";
import "./Header.css";

export default function Header({ isLoggedIn = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="kd-header">
      <div className="kd-header-inner">

        {/* LEFT: LOGO */}
        <Link to="/" className="kd-logo">
          <img
            src="/images/cow-icon.png"
            alt="Kamdhenu"
            className="kd-logo-img"
          />
          <div className="kd-logo-text">
            <div className="kd-logo-title">कामधेनु Kamdhenu</div>
            <div className="kd-logo-sub">Sacred Blessings</div>
          </div>
        </Link>

        {/* CENTER: NAV */}
        <nav className="kd-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* RIGHT: ACTIONS */}
        <div className="kd-actions">

          {/* Cart */}
          <button className="kd-icon-btn" aria-label="Cart">
            <ShoppingCart size={20} />
          </button>

          {/* Profile OR Login */}
          {isLoggedIn ? (
            <button className="kd-icon-btn" aria-label="Profile">
              <User size={20} />
            </button>
          ) : (
            <Link to="/login" className="kd-login-btn">
              Login / Sign Up
            </Link>
          )}

          {/* Hamburger */}
          <button
            className="kd-icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU (basic placeholder) */}
      {menuOpen && (
        <div className="kd-mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/catalog">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="kd-nav-link">
      {children}
    </Link>
  );
}
