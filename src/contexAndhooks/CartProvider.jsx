import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (FIXED 🔥)
  const addToCart = (item) => {
    setCartItems((prev) => {
      // 🔥 FIX: Compare using src (NOT title)
      const existingIndex = prev.findIndex(i => i.src === item.src);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update qty
  const updateQuantity = (index, amount) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + amount
      };
      if (updated[index].quantity <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
