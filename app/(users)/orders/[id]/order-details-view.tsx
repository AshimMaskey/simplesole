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
    <div className="space-y-6">
      {/* Status and Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Badge
              className={
                statusColors[order.status as keyof typeof statusColors]
              }
            >
              {order.status}
            </Badge>

            {/* Timeline */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        idx <= currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx < currentStepIndex ? "✓" : idx + 1}
                    </div>
                    <p className="text-xs text-center">{step}</p>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`flex-1 h-1 my-2 ${
                          idx < currentStepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Ordered on{" "}
              {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-0"
              >
                {item.variant.product.images?.[0] && (
                  <Image
                    src={item.variant.product.images[0] || "/placeholder.svg"}
                    alt={item.variant.product.name}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{item.variant.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variant.color} - {item.variant.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Rs. {(item.price * item.quantity).toFixed(2)} total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {order.shippingAddress}
            </p>
            <Separator className="my-4" />
            <p className="font-semibold text-sm">Phone</p>
            <p className="text-sm">{order.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {order.billingAddress}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs. {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>Rs. {order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Rs. {order.shipping.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rs. {order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{order.paymentMethod}</p>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
