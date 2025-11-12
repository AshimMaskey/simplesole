"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "@/app/(users)/wishlist/actions/wishlist";
import { Spinner } from "@/components/ui/spinner";
import { useWishlist } from "@/contexts/WishlistContext";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { refreshCount } = useWishlist();
  const { user } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setInitialLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await isProductInWishlist(user.id, productId);
        if (res.success) setIsWishlisted(res.exists);
        else toast.error("Failed to fetch wishlist status");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch wishlist status");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchStatus();
  }, [user, productId]);

  const handleWishlistToggle = async () => {
    if (!user) return toast.error("Please log in first!");
    setLoading(true);

    try {
      if (isWishlisted) {
        const res = await removeFromWishlist(user.id, productId);
        if (res.success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
          refreshCount(); // ✅ refresh badge
        } else {
          toast.error(res.error || "Failed to remove from wishlist");
        }
      } else {
        const res = await addToWishlist(user.id, productId);
        if (res.success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
          refreshCount(); // ✅ refresh badge
        } else {
          toast.error(res.error || "Failed to add to wishlist");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };
  if (initialLoading) {
    return (
      <button
        className="flex items-center justify-center border px-6 py-4 rounded-lg border-gray-300 bg-gray-100"
        disabled
      >
        <Spinner className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <button
      className={`flex cursor-pointer items-center gap-2 border px-6 py-4 rounded-lg transition ${
        isWishlisted
          ? "bg-red-100 border-red-400"
          : "border-gray-300 hover:bg-gray-100"
      }`}
      onClick={handleWishlistToggle}
      disabled={loading}
    >
      {loading ? (
        <Spinner className="w-5 h-5 text-gray-600" />
      ) : (
        <Heart
          className="w-5 h-5"
          color={isWishlisted ? "#ef4444" : "#6b7280"}
          fill={isWishlisted ? "#ef4444" : "none"}
          strokeWidth={2}
        />
      )}
      <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
    </button>
  );
}
