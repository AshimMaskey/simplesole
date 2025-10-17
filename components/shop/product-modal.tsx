"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductVariant } from "@/types/product";
import { ShoppingCart, Package } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
}

export function ProductModal({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!product) return null;

  const availableSizes = [
    ...new Set(product.variants?.map((v) => v.size) || []),
  ];
  const availableColors = [
    ...new Set(
      product.variants
        ?.filter((v) => !selectedSize || v.size === selectedSize)
        .map((v) => v.color) || []
    ),
  ];

  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant);
    setSelectedSize("");
    setSelectedColor("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.status === "inactive" && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product.created_at >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                <Badge className="bg-primary text-primary-foreground">
                  New
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.category}
              </p>
              <p className="text-3xl font-bold">
                ${product.base_price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {product.total_stock > 0
                  ? `${product.total_stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {product.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Select Size</h4>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          Size {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSize && (
                  <div>
                    <h4 className="font-semibold mb-2">Select Color</h4>
                    <Select
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedVariant && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">SKU:</span>{" "}
                      {selectedVariant.sku}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Stock:</span>{" "}
                      {selectedVariant.stock} available
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={
                product.status === "inactive" ||
                (product.variants &&
                  product.variants.length > 0 &&
                  !selectedVariant)
              }
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
