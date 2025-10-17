"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartItem } from "@/types/product";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const { product, variant, quantity } = item;
  const itemTotal = product.base_price * quantity;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-balance">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.category}
              </p>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="text-muted-foreground">
                  Size:{" "}
                  <span className="text-foreground font-medium">
                    {variant.size}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Color:{" "}
                  <span className="text-foreground font-medium">
                    {variant.color}
                  </span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold text-lg">${itemTotal.toFixed(2)}</p>
              {quantity > 1 && (
                <p className="text-sm text-muted-foreground">
                  ${product.base_price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  onUpdateQuantity(item.id, Math.max(1, quantity - 1))
                }
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                disabled={quantity >= variant.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
