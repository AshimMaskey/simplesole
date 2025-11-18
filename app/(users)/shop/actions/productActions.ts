"use server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getProducts = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { created_at: "desc" },
    });
    return products;
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);
