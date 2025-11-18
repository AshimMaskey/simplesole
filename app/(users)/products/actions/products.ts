"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getProductById = unstable_cache(
  async (productId: string) => {
    try {
      prisma.product
        .update({
          where: { id: productId },
          data: { views: { increment: 1 } },
        })
        .catch(() => {});

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          variants: true,
        },
      });

      return product;
    } catch (err) {
      console.error("Error loading product:", err);
      return null;
    }
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

//for mens
export async function getRandomMensProduct() {
  const products = await prisma.product.findMany({
    where: { category: { contains: "men", mode: "insensitive" } },
    take: 10,
  });

  if (products.length === 0) return null;

  const random = products[Math.floor(Math.random() * products.length)];
  return random;
}
