"use server";
import { prisma } from "@/lib/prisma";
import type { Product, ProductVariant } from "@/types/product";

export async function saveProduct(
  data: Product & { variants?: ProductVariant[] }
) {
  if (data.id) {
    // Edit product
    const updated = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        base_price: data.base_price,
        total_stock: data.total_stock,
        status: data.status,
        images: data.images,
        variants: {
          deleteMany: {}, // remove old variants
          create: data.variants || [],
        },
      },
      include: { variants: true },
    });
    return updated;
  } else {
    // Add new product
    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        base_price: data.base_price,
        total_stock: data.total_stock,
        status: data.status,
        images: data.images,
        variants: {
          create: data.variants || [],
        },
      },
      include: { variants: true },
    });
    return created;
  }
}

export async function deleteProduct(productId: string) {
  // Delete product and cascade variants
  await prisma.product.delete({
    where: { id: productId },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: { variants: true },
    orderBy: { created_at: "desc" },
  });
}
