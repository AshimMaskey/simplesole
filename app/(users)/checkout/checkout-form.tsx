"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "@prisma/client";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";

interface CheckoutFormProps {
  userId: string;
}

export default function CheckoutForm({ userId }: CheckoutFormProps) {
  const router = useRouter();
  const { refreshCount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const order = await createOrder(userId, {
        shippingAddress: formData.get("shippingAddress") as string,
        billingAddress: formData.get("billingAddress") as string,
        phone: formData.get("phone") as string,
        paymentMethod,
        notes: formData.get("notes") as string,
      });
      refreshCount();
      router.push(`/order-success/${order.id}`);
      toast.success("Order placed Successfully!");
    } catch (err) {
      toast.error("Error while placing order!");
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <Card className="border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Shipping Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              name="shippingAddress"
              placeholder="Enter your full address"
              required
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Textarea
              id="billingAddress"
              name="billingAddress"
              placeholder="Leave blank to use shipping address"
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Payment Method
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            className="space-y-3"
          >
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border transition hover:bg-muted cursor-pointer 
              ${paymentMethod === "COD" ? "border-primary shadow-sm" : ""}
            `}
              onClick={() => setPaymentMethod("COD")}
            >
              <RadioGroupItem value="COD" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="font-medium">Cash on Delivery (COD)</div>
                <p className="text-sm text-muted-foreground">
                  Pay directly when your order arrives
                </p>
              </Label>
            </div>

            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border transition hover:bg-muted cursor-pointer 
              ${paymentMethod === "ESEWA" ? "border-primary shadow-sm" : ""}
            `}
              onClick={() => setPaymentMethod("ESEWA")}
            >
              <RadioGroupItem value="ESEWA" id="esewa" />
              <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                <div className="font-medium">eSewa</div>
                <p className="text-sm text-muted-foreground">
                  Secure digital payment via eSewa
                </p>
              </Label>
            </div>
          </RadioGroup> */}
          <RadioGroup value={paymentMethod} className="space-y-3">
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl border transition hover:bg-muted cursor-pointer 
    ${paymentMethod === "COD" ? "border-primary shadow-sm" : ""}
  `}
            >
              <RadioGroupItem value="COD" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="font-medium">Cash on Delivery (COD)</div>
                <p className="text-sm text-muted-foreground">
                  Pay directly when your order arrives
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card className="border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Order Notes</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            name="notes"
            placeholder="Any special instructions for delivery..."
            className="min-h-20"
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold rounded-xl"
        disabled={isLoading}
      >
        {isLoading ? "Processing Order..." : "Place Order"}
      </Button>
    </form>
  );
}
