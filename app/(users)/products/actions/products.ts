"use server";

import { prisma } from "@/lib/prisma";

export async function getProductById(productId: string) {
  try {
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
}
