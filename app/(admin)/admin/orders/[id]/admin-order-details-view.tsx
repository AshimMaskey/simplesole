"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { format } from "date-fns";
import { Audience, OrderStatus, PaymentMethod, Role } from "@prisma/client";

interface AdminOrderDetailsViewProps {
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
  userRole: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

const validTransitions: Record<string, string[]> = {
  PENDING: ["PROCESSING", "CANCELED"],
  PROCESSING: ["SHIPPED", "CANCELED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELED: [],
};

export default function AdminOrderDetailsView({
  order,
  userRole,
}: AdminOrderDetailsViewProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateOrderStatus(
        order.id,
        selectedStatus as OrderStatus,
        userRole
      );
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order status"
      );
      setSelectedStatus(order.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Update Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>Order Status Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Current Status
              </label>
              <Badge
                className={
                  statusColors[order.status as keyof typeof statusColors]
                }
              >
                {order.status}
              </Badge>
            </div>

            <div className="flex-1">
              <label
                htmlFor="status-select"
                className="block text-sm font-medium mb-2"
              >
                Update to
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as OrderStatus)
                }
              >
                <SelectTrigger id="status-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {validTransitions[order.status]?.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStatusUpdate}
              disabled={
                isUpdating ||
                selectedStatus === order.status ||
                validTransitions[order.status]?.length === 0
              }
              className="self-end"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-semibold">{order.user.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-semibold">{order.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-semibold">{order.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-semibold">
              {format(new Date(order.createdAt), "MMMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({order.orderItems.length})</CardTitle>
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
                    SKU: {item.variant.sku}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.variant.color} - Size: {item.variant.size}
                  </p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    x{item.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {order.shippingAddress}
            </p>
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
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>Rs. {order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {order.shipping === 0
                ? "Free"
                : `Rs. ${order.shipping.toFixed(2)}`}
            </span>
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
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Method: {order.paymentMethod}</p>
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
