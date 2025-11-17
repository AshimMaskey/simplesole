"use client";

import { useEffect, useState } from "react";
import { calculateCartTotal, getCartByUser } from "@/app/actions/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckoutSummaryProps {
  userId: string;
}
interface CartItem {
  id: string;
  quantity: number;
  addedAt: Date;
  updatedAt: Date;
  variant: {
    id: string;
    size: string;
    color: string;
    product: {
      id: string;
      name: string;
      base_price: number;
      images: string[];
    };
  };
}

interface ICartTotalResponse {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export default function CheckoutSummary({ userId }: CheckoutSummaryProps) {
  const [summary, setSummary] = useState<ICartTotalResponse | null>(null);
  console.log(summary);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  console.log(cartItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totals = await calculateCartTotal(userId);
        setSummary(totals);

        const items = await getCartByUser(userId);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching checkout summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="sticky top-4 p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Cart items skeleton (NO SCROLL) */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 pb-4 border-b">
              <Skeleton className="h-14 w-14 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Totals skeleton */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex justify-between pt-2 border-t">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </Card>
    );
  }

  if (!summary || cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b">
              {item.variant.product.images?.[0] && (
                <Image
                  src={item.variant.product.images[0] || "/placeholder.svg"}
                  alt={item.variant.product.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
              )}
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.variant.product.name}</p>
                <p className="text-muted-foreground">
                  {item.variant.color} - {item.variant.size}
                </p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">
                Rs.{" "}
                {(item.variant.product.base_price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs. {summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (0%)</span>
            <span>Rs. {summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className={summary.shipping === 0 ? "text-green-600" : ""}>
              {summary.shipping === 0
                ? "Free"
                : `Rs. ${summary.shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>Rs. {summary.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
