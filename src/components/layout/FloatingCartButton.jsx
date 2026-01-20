import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function FloatingCartButton() {
  const { items } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <button
      className="kd-floating-cart"
      onClick={() => navigate("/checkout")}
    >
      🛒
      <span>{items.length}</span>
    </button>
  );
}
