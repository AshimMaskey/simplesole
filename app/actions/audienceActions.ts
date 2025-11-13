import prisma from "@/lib/prisma";
import { Audience } from "@prisma/client";

export async function getProductsByAudience(audience: Audience) {
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
}
