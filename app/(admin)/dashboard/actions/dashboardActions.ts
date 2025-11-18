import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Total counts
export const getDashboardCounts = unstable_cache(
  async () => {
    const [totalUsers, totalProducts, totalReviews, totalOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.review.count(),
        prisma.order.count(),
      ]);
    return { totalUsers, totalProducts, totalReviews, totalOrders };
  },
  ["dashboardCounts"],
  { revalidate: 60 }
);

// Orders by status
export const getOrderStatusCounts = unstable_cache(
  async () => {
    const counts = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return counts.map((c) => ({
      status: c.status,
      count: c._count.status,
    }));
  },
  ["orderStatusCounts"],
  { revalidate: 60 }
);

// Stock by audience
export const getStockByAudience = unstable_cache(
  async () => {
    const stocks = await prisma.product.groupBy({
      by: ["audience"],
      _sum: { total_stock: true },
    });

    return stocks.map((s) => ({
      audience: s.audience,
      stock: s._sum.total_stock ?? 0,
    }));
  },
  ["stockByAudience"],
  { revalidate: 60 }
);
