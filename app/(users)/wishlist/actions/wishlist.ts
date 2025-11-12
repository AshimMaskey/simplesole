"use server";

import prisma from "@/lib/prisma";
export async function addToWishlist(userId: string, productId: string) {
  try {
    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {},
      create: { userId, productId },
    });

    return { success: true, data: wishlistItem };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: "Failed to add to wishlist" };
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    await prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: "Failed to remove from wishlist" };
  }
}

export async function getWishlistByUser(userId: string) {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            base_price: true,
            total_stock: true,
            images: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    return { success: true, data: wishlist };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Failed to fetch wishlist" };
  }
}

export async function getWishlistCount(userId: string) {
  try {
    console.log(userId);
    const count = await prisma.wishlist.count({
      where: { userId },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error counting wishlist:", error);
    return { success: false, error: "Failed to count wishlist items" };
  }
}

export async function isProductInWishlist(userId: string, productId: string) {
  try {
    const exists = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { id: true },
    });

    return { success: true, exists: !!exists };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return { success: false, exists: false };
  }
}
