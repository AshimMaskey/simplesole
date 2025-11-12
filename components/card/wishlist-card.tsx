"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WishlistByUserItem } from "@/types/wishlist";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface WishlistCardProps {
  item: WishlistByUserItem;
  onRemove: (wishlistId: string, productId: string) => Promise<void>;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id, item.product.id);
    setRemoving(false);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted rounded-md">
        <Image
          src={item.product.images[0] || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={handleRemove}
          disabled={removing}
        >
          {removing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
          )}
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-balance mb-1">
            {item.product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {item.product.category}
          </span>
          <span className="font-semibold text-lg">
            ${item.product.base_price.toFixed(2)}
          </span>
        </div>

        <Link href={`/products/${item.product.id}`}>
          <Button className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
