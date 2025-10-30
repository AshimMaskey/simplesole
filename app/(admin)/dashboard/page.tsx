import React from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {
  IconShoppingCart,
  IconUsers,
  IconBox,
  IconTag,
  IconMessageCircle,
} from "@tabler/icons-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,245",
      icon: <IconShoppingCart className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Total Users",
      value: "532",
      icon: <IconUsers className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Inventory",
      value: "870",
      icon: <IconBox className="h-6 w-6 text-yellow-500" />,
    },
    // {
    //   title: "Inventory",
    //   value: "870",
    //   icon: <IconBox className="h-6 w-6 text-yellow-500" />,
    // },
    // {
    //   title: "Inventory",
    //   value: "870",
    //   icon: <IconBox className="h-6 w-6 text-yellow-500" />,
    // },
    // {
    //   title: "Inventory",
    //   value: "870",
    //   icon: <IconBox className="h-6 w-6 text-yellow-500" />,
    // },
    // {
    //   title: "Inventory",
    //   value: "870",
    //   icon: <IconBox className="h-6 w-6 text-yellow-500" />,
    // },
    {
      title: "Discounts Active",
      value: "12",
      icon: <IconTag className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Reviews",
      value: "256",
      icon: <IconMessageCircle className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-3 font-semibold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quick overview of your store&apos;s key metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center rounded-sm gap-4 p-4">
            {stat.icon}
            <div>
              <CardTitle className="text-lg">{stat.title}</CardTitle>
              <CardContent className="text-xl text-center font-bold">
                {stat.value}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
