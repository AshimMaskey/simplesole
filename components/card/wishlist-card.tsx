"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WishlistItem } from "@/types/product";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (productId: string) => void;
}

export function WishlistCard({
  item,
  onRemove,
  onAddToCart,
}: WishlistCardProps) {
  const { product } = item;
  const isOutOfStock = product.total_stock === 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
          >
            Out of Stock
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={() => onRemove(item.id)}
        >
          <Heart className="h-5 w-5 fill-destructive text-destructive" />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-balance mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {product.category}
          </span>
          <span className="font-semibold text-lg">
            ${product.base_price.toFixed(2)}
          </span>
        </div>

        <Button
          className="w-full"
          onClick={() => onAddToCart(product.id)}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}
