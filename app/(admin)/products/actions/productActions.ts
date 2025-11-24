"use server";
import prisma from "@/lib/prisma";
import type { Product, ProductVariant } from "@/types/product";
import { revalidateTag, unstable_cache } from "next/cache";

export async function saveProduct(
  data: Product & { variants?: ProductVariant[] }
) {
  const variantData = (data.variants || []).map((variant) => ({
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
    sku: variant.sku,
  }));

  if (data.id) {
    // ✏️ Edit existing product
    const updated = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        audience: data.audience,
        base_price: data.base_price,
        total_stock: data.total_stock,
        status: data.status,
        images: data.images,
        variants: {
          deleteMany: {}, // clear existing variants
          create: variantData, // ✅ cleaned variant data
        },
      },
      include: { variants: true },
    });

    revalidateTag("products");
    return updated;
  } else {
    // ➕ Create new product
    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        audience: data.audience,
        base_price: data.base_price,
        total_stock: data.total_stock,
        status: data.status,
        images: data.images,
        variants: {
          create: variantData, // ✅ cleaned variant data
        },
      },
      include: { variants: true },
    });
    revalidateTag("products");
    return created;
  }
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: { id: productId },
  });
  revalidateTag("products");
}

export const getProducts = unstable_cache(
  async () => {
    console.log("running");
    return prisma.product.findMany({
      include: { variants: true },
      orderBy: { created_at: "desc" },
    });
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);
