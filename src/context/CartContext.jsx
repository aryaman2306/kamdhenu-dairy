import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('kamdhenu_cart_v1');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('LocalStorage load failed:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kamdhenu_cart_v1', JSON.stringify(items));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }, [items]);

  function setItemQuantity(product, quantity) {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((it) => it.productId !== product.id);
      }

      const existing = prev.find((it) => it.productId === product.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id ? { ...it, quantity } : it
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unit: product.unit,
          pricePerUnit: Number(product.price_per_unit),
          quantity,
        },
      ];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, it) => sum + Number(it.pricePerUnit) * Number(it.quantity),
      0
    );
  }, [items]);

  const value = {
    items,
    setItemQuantity,
    removeItem,
    clearCart,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
