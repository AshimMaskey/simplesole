"use client";

import { Card } from "@/components/ui/card";
import { Package, Heart, ShoppingBag, TrendingUp } from "lucide-react";

interface ProfileStatsProps {
  totalOrders: number;
  wishlistItems: number;
  totalSpent: number;
}

export function ProfileStats({
  totalOrders,
  wishlistItems,
  totalSpent,
}: ProfileStatsProps) {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Avg Order Value",
      value: `$${(totalSpent / totalOrders).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
