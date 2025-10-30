"use server";

import { prisma } from "@/lib/prisma";

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { created_at: "desc" },
  });
  return products;
};
