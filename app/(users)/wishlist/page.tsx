"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistCard } from "@/components/card/wishlist-card";
import toast from "react-hot-toast";

import {
  getWishlistByUser,
  removeFromWishlist,
} from "@/app/(users)/wishlist/actions/wishlist";
import { useUser } from "@clerk/nextjs";
import { WishlistByUserItem } from "@/types/wishlist";
import { useWishlist } from "@/contexts/WishlistContext";
import Spinner from "@/components/spinner/Spinner";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistByUserItem[] | []>(
    []
  );
  const { refreshCount } = useWishlist();
  const { user } = useUser();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchWishlist() {
      setLoading(true);
      const res = await getWishlistByUser(userId || "fallback");
      if (res.success && res.data) {
        setWishlistItems(res.data);
      } else {
        toast.error(res.error || "Failed to load wishlist");
      }
      setLoading(false);
    }

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (id: string, productId: string) => {
    const res = await removeFromWishlist(userId || "fallback", productId);
    if (res.success) {
      refreshCount();
      setWishlistItems((items) => items.filter((item) => item.id !== id));
      toast.success("Item removed from wishlist");
    } else {
      toast.error(res.error || "Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <Spinner />
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>

          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Save your favorite items to your wishlist so you can easily find
              them later!
            </p>
            <Link href="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/shop">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      </div>
    </div>
  );
}
