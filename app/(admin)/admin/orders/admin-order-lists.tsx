"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Audience, OrderStatus, PaymentMethod, Role } from "@prisma/client";

export interface AllOrdersResponse {
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
}

interface AdminOrdersListProps {
  orders: AllOrdersResponse[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export default function AdminOrdersList({ orders }: AdminOrdersListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Order ID</th>
            <th className="text-left p-4">Customer</th>
            <th className="text-left p-4">Total</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Payment</th>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <code className="text-xs">{order.id.slice(0, 8)}</code>
              </td>
              <td className="p-4">
                <div>
                  <p className="font-medium">{order.user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.email}
                  </p>
                </div>
              </td>
              <td className="p-4 font-semibold">
                Rs. {order.total.toFixed(2)}
              </td>
              <td className="p-4">
                <Badge
                  className={
                    statusColors[order.status as keyof typeof statusColors]
                  }
                >
                  {order.status}
                </Badge>
              </td>
              <td className="p-4 text-xs">{order.paymentMethod}</td>
              <td className="p-4 text-xs">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </td>
              <td className="p-4">
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
