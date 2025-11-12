"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItemCard } from "@/components/card/cart-item-card";
import toast from "react-hot-toast";
import type { CartItem } from "@/types/cart";
import {
  getCartByUser,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "./actions/cart";
import { useUser } from "@clerk/nextjs";

export default function CartPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Per-item loading states
  const [loadingRemoveAll, setLoadingRemoveAll] = useState(false);

  const [loadingIncreaseId, setLoadingIncreaseId] = useState<string | null>(
    null
  );
  const [loadingDecreaseId, setLoadingDecreaseId] = useState<string | null>(
    null
  );
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const items = await getCartByUser(userId || "");
      setCartItems(items);
    } catch {
      toast.error("Failed to load cart.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Quantity increase
  const handleIncrease = async (cartId: string, quantity: number) => {
    setLoadingIncreaseId(cartId);
    try {
      await updateCartQuantity(cartId, quantity);
      await fetchCart();
      toast.success("Quantity increased!");
    } catch {
      toast.error("Failed to update quantity.");
    } finally {
      setLoadingIncreaseId(null);
    }
  };

  const handleRemoveAll = async () => {
    if (!userId) return toast.error("User not found");

    setLoadingRemoveAll(true);
    try {
      await clearCart(userId);
      await fetchCart(); // refresh cart
      toast.success("All items removed from cart!");
    } catch {
      toast.error("Failed to remove all items.");
    } finally {
      setLoadingRemoveAll(false);
    }
  };

  // Quantity decrease
  const handleDecrease = async (cartId: string, quantity: number) => {
    setLoadingDecreaseId(cartId);
    try {
      await updateCartQuantity(cartId, quantity);
      await fetchCart();
      toast.success("Quantity decreased!");
    } catch {
      toast.error("Failed to update quantity.");
    } finally {
      setLoadingDecreaseId(null);
    }
  };

  // Remove item
  const handleDelete = async (cartId: string) => {
    setLoadingDeleteId(cartId);
    try {
      await removeFromCart(cartId);
      await fetchCart();
      toast.success("Item removed!");
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // Cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.product.base_price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                onClick={handleRemoveAll}
                disabled={loadingRemoveAll}
              >
                {loadingRemoveAll ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Remove All
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading cart items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-2">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Your cart is empty</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Looks like you haven&apos;t added anything to your cart yet.
                </p>
                <Link href="/">
                  <Button size="lg" className="mt-4">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  loadingIncrease={loadingIncreaseId === item.id}
                  loadingDecrease={loadingDecreaseId === item.id}
                  loadingDelete={loadingDeleteId === item.id}
                  onIncrease={() => handleIncrease(item.id, item.quantity + 1)}
                  onDecrease={() => handleDecrease(item.id, item.quantity - 1)}
                  onRemove={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>

              {subtotal < 100 && (
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
