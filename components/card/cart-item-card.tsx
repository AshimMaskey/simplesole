"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartItem } from "@/types/cart";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  loadingIncrease?: boolean;
  loadingDecrease?: boolean;
  loadingDelete?: boolean;
}

export function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  loadingIncrease = false,
  loadingDecrease = false,
  loadingDelete = false,
}: CartItemCardProps) {
  const { variant, quantity } = item;
  const itemTotal = variant.product.base_price * quantity;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={variant.product.images[0] || "/product_placeholder.jpeg"}
            alt={variant.product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-balance">
                {variant.product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {variant.product.category}
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
                  ${variant.product.base_price.toFixed(2)} each
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
                onClick={onDecrease}
                disabled={quantity <= 1 || loadingDecrease}
              >
                {loadingDecrease ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </Button>

              <span className="w-12 text-center font-medium">{quantity}</span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={onIncrease}
                disabled={quantity >= variant.stock || loadingIncrease}
              >
                {loadingIncrease ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
