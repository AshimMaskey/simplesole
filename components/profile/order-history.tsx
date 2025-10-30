"use client";

import type { Order } from "@/types/users";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import Image from "next/image";

interface OrderHistoryProps {
  orders: Order[];
}

const statusColors = {
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderHistory({ orders }: OrderHistoryProps) {
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
                    Order {order.orderNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(order.date, "MMMM d, yyyy")}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={statusColors[order.status]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 relative h-16 w-16 rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} •
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
