"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getCartCount } from "@/app/(users)/cart/actions/cart";

interface CartContextType {
  count: number;
  setCount: (value: number) => void;
  refreshCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [count, setCount] = useState(0);

  const refreshCount = async () => {
    if (!user) return;
    try {
      const cartCount = await getCartCount(user.id);
      setCount(cartCount || 0);
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  };

  useEffect(() => {
    refreshCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ count, setCount, refreshCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
