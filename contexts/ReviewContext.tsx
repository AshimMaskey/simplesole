"use client";
import {
  getUnseenReviewsCount,
  markAllReviewsSeen,
} from "@/app/actions/reviews";
import { createContext, useContext, useEffect, useState } from "react";

type ReviewContextType = {
  unseenCount: number;
  setUnseenCount: (n: number) => void;
  markSeen: () => Promise<void>;
};

const ReviewContext = createContext<ReviewContextType | null>(null);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [unseenCount, setUnseenCount] = useState(0);
  const refreshCount = async () => {
    try {
      const unseenCountData = await getUnseenReviewsCount();
      setUnseenCount(unseenCountData || 0);
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  };
  useEffect(() => {
    refreshCount();
  }, []);

  async function markSeen() {
    setUnseenCount(0);
    try {
      await markAllReviewsSeen();
      refreshCount();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ReviewContext.Provider value={{ unseenCount, setUnseenCount, markSeen }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviewContext() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviewContext must be inside ReviewProvider");
  return ctx;
}
