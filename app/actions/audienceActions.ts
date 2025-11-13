import prisma from "@/lib/prisma";

export async function getMensProducts(
  audience: "MENS" | "WOMENS" | "KIDS" | "UNISEX"
) {
  const products = await prisma.product.findMany({
    where: {
      audience,
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
