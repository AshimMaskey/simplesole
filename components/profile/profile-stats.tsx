"use client";

import { Card } from "@/components/ui/card";
import { Package, Heart } from "lucide-react";

interface ProfileStatsProps {
  totalOrders: number;
  wishlistItems: number;
}

export function ProfileStats({
  totalOrders,
  wishlistItems,
}: ProfileStatsProps) {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems || 0,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
