import prisma from "@/lib/prisma";
import { Audience } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const getProductsByAudience = unstable_cache(
  async (audience: Audience) => {
    const products = await prisma.product.findMany({
      where: {
        audience: audience,
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        base_price: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return products;
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);
