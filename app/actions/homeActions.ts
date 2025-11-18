"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getFeaturedProducts = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          base_price: true,
          images: true,
        },
        orderBy: {
          views: "desc",
        },
        take: 4,
      });

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);
