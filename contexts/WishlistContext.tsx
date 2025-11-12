"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getWishlistCount } from "@/app/(users)/wishlist/actions/wishlist";

interface WishlistContextType {
  count: number;
  setCount: (value: number) => void;
  refreshCount: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [count, setCount] = useState(0);

  const refreshCount = async () => {
    if (!user) return;
    const res = await getWishlistCount(user.id);
    if (res.success) setCount(res.count || 0);
  };

  useEffect(() => {
    refreshCount();
  }, [user]);

  return (
    <WishlistContext.Provider value={{ count, setCount, refreshCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
