import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function FloatingCartButton() {
  const navigate = useNavigate();
  const { cartCount } = useCart(); // ✅ FIXED

  // If cart is empty, don't show floating button
  if (!cartCount || cartCount === 0) return null;

  return (
    <button
      className="floating-cart-btn"
      onClick={() => navigate("/checkout")}
      aria-label="View Cart"
    >
      <ShoppingCart size={20} />
      <span className="floating-cart-badge">{cartCount}</span>
    </button>
  );
}
