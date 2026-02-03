import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../supabaseClient";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="kd-header">
      <div className="kd-header-inner">
        {/* LOGO */}
        <Link to="/" className="kd-logo">
          <img src="/images/cow-icon.png" alt="Kamdhenu" className="kd-logo-img" />
          <div className="kd-logo-text">
            <div className="kd-logo-title">कामधेनु Kamdhenu</div>
            <div className="kd-logo-sub">Dairy</div>
          </div>
        </Link>

        {/* NAV */}
        <nav className="kd-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/support">Support</NavLink>
        </nav>

        {/* ACTIONS */}
        <div className="kd-actions">
          {/* Cart */}
          <button
            className="kd-icon-btn kd-cart-btn"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="kd-cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Login OR Profile */}
          {isLoggedIn ? (
            <button
              className="kd-icon-btn"
              onClick={() => navigate("/profile")}
            >
              <User size={20} />
            </button>
          ) : (
            <Link to="/login" className="kd-login-btn">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
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
