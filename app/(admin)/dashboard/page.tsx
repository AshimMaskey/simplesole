import React from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {
  IconShoppingCart,
  IconUsers,
  IconBox,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  getDashboardCounts,
  getOrderStatusCounts,
  getStockByAudience,
} from "./actions/dashboardActions";
import OrderStatusPieChart from "@/components/dashboard/OrderStatusPiechart";
import AudienceStockBarChart from "@/components/dashboard/StockByAudBarchart";
import Link from "next/link";
const AdminDashboard = async () => {
  const dashboardCount = await getDashboardCounts();
  const statusCount = await getOrderStatusCounts();
  const stockData = await getStockByAudience();
  const stats = [
    {
      title: "Total Users",
      value: dashboardCount.totalUsers || 0,
      icon: <IconUsers className="h-6 w-6 text-green-500" />,
      link: "/users",
    },
    {
      title: "Total Products",
      value: dashboardCount.totalProducts || 0,
      icon: <IconBox className="h-6 w-6 text-yellow-500" />,
      link: "/products",
    },

    {
      title: "Total Orders",
      value: dashboardCount.totalOrders || 0,
      icon: <IconShoppingCart className="h-6 w-6 text-blue-500" />,
      link: "/admin/orders",
    },
    {
      title: "Reviews",
      value: dashboardCount.totalReviews || 0,
      icon: <IconMessageCircle className="h-6 w-6 text-purple-500" />,
      link: "/reviews",
    },
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Quick overview of your store&apos;s key metrics.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.link}>
            <Card className="flex items-center p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              {" "}
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                {stat.icon}
              </div>
              <div className="ml-4">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <CardContent className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Pie Chart */}
        <div className="bg-white dark:bg-gray-900 p-4 pb-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Orders by Status
          </h2>
          <OrderStatusPieChart data={statusCount} />
        </div>

        {/* Audience Stock Bar Chart */}
        <div className="bg-white dark:bg-gray-900 p-4 pb-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Stock by Audience
          </h2>
          <AudienceStockBarChart data={stockData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
