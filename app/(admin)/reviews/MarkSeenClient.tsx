"use client";

import { useReviewContext } from "@/contexts/ReviewContext";
import { useEffect } from "react";

export function MarkSeenClient() {
  const { markSeen } = useReviewContext();
  useEffect(() => {
    markSeen();
  }, [markSeen]);

  return null;
}
