"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";
import { Audience, OrderStatus, PaymentMethod, Role } from "@prisma/client";

interface OrderDetailsViewProps {
  order: {
    id: string;
    userId: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    billingAddress: string | null;
    phone: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;

    user: {
      id: string;
      fullName: string | null;
      email: string | null;
      phone: string | null;
      image_url: string | null;
      role: Role;
    };

    orderItems: {
      id: string;
      quantity: number;
      price: number;
      createdAt: Date;

      variant: {
        id: string;
        size: string;
        color: string;
        stock: number;
        sku: string;

        product: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          audience: Audience;
          base_price: number;
          total_stock: number;
          status: string;
          views: number;
          images: string[];
          created_at: Date;
        };
      };
    }[];
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

const statusSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <Card className="shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <Badge
              className={
                statusColors[order.status as keyof typeof statusColors]
              }
            >
              {order.status}
            </Badge>

            <Badge variant="outline">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => (
              <div
                key={step}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-semibold
                ${
                  idx <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                >
                  {idx < currentStepIndex ? "✓" : idx + 1}
                </div>
                <span className="text-xs">{step}</span>
                {/* {idx < statusSteps.length - 1 && (
                  <div
                    className={`h-1 w-full mt-2 ${
                      idx < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )} */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b pb-4 last:border-0"
              >
                <Image
                  src={item.variant.product.images?.[0] || "/placeholder.svg"}
                  alt={item.variant.product.name}
                  width={90}
                  height={90}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold text-base">
                    {item.variant.product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.variant.color} • {item.variant.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">Rs. {item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rs. {order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {order.shipping.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
            <Separator />
            <p className="font-semibold">Phone</p>
            <p>{order.phone}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">
            {order.billingAddress || "Same as shipping address"}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {order.notes && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{order.notes}</CardContent>
        </Card>
      )}
    </div>
  );
}
