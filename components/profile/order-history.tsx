"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "@prisma/client";
import Link from "next/link";

interface OrderHistoryProps {
  userId: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${userId}`);
        const data = await res.json();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                  <div className="h-5 w-20 bg-muted rounded"></div>
                </div>

                <div className="h-4 w-48 bg-muted rounded"></div>

                <div className="flex justify-between pt-2 border-t">
                  <div className="h-4 w-40 bg-muted rounded"></div>
                  <div className="h-5 w-24 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">
          Start shopping to see your orders here
        </p>
        <Button>Browse Products</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(order.createdAt, "MMMM d, yyyy")}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={statusColors[order.status]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
