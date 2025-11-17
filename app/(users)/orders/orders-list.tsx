"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@prisma/client";
import { format } from "date-fns";

interface OrdersListProps {
  orders: Order[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export default function OrdersList({ orders }: OrdersListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <Badge
                    className={
                      statusColors[order.status as keyof typeof statusColors]
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payment: {order.paymentMethod}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  Rs. {order.total.toFixed(2)}
                </p>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
