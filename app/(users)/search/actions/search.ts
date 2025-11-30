"use server";

import prisma from "@/lib/prisma";

export async function searchProducts(query: string, sortBy: string) {
  if (!query.trim()) return [];

  const q = query.toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      variants: true,
    },
  });

  switch (sortBy) {
    case "price-low":
      products.sort((a, b) => a.base_price - b.base_price);
      break;
    case "price-high":
      products.sort((a, b) => b.base_price - a.base_price);
      break;
    case "newest":
      products.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      break;
    default:
      products.sort((a, b) => {
        const aMatch = a.name.toLowerCase().includes(q) ? 1 : 0;
        const bMatch = b.name.toLowerCase().includes(q) ? 1 : 0;
        return bMatch - aMatch;
      });
      break;
  }

  return products;
}
