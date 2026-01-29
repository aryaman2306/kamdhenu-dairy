import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "kamdhenu_cart_v1";

export function CartProvider({ children }) {
  const hasHydrated = useRef(false);

  // 🔒 SINGLE hydration point
  const [cartItems, setCartItems] = useState([]);

  // ✅ Hydrate cart ONLY once on mount
  useEffect(() => {
    if (hasHydrated.current) return;

    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCartItems(JSON.parse(stored));
      }
    } catch {
      setCartItems([]);
    }

    hasHydrated.current = true;
  }, []);

  // ✅ Persist cart after hydration
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // ✅ HARD RESET — no rehydration possible
  function clearCart() {
    hasHydrated.current = false;
    localStorage.removeItem(CART_KEY);
    setCartItems([]);
    hasHydrated.current = true;
  }

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price_per_unit * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalAmount,
        addToCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
