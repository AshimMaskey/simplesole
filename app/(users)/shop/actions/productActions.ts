"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getProducts = cache(async () => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { created_at: "desc" },
  });
  return products;
});
