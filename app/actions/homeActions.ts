"use server";

import prisma from "@/lib/prisma";

export async function getFeaturedProducts() {
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
        created_at: "asc",
      },
      take: 4,
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
