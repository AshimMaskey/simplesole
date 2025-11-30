"use server";

import prisma from "@/lib/prisma";

export async function addToCart(
  userId: string,
  variantId: string,
  quantity: number = 1
) {
  try {
    const existingItem = await prisma.cart.findUnique({
      where: {
        userId_variantId: { userId, variantId },
      },
    });

    if (existingItem) {
      const updated = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return updated;
    }

    const newItem = await prisma.cart.create({
      data: {
        userId,
        variantId,
        quantity,
      },
    });

    return newItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart.");
  }
}

export async function getCartByUser(userId: string) {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    return cartItems;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Failed to load cart.");
  }
}

export async function updateCartQuantity(cartId: string, quantity: number) {
  try {
    if (quantity < 1) {
      await prisma.cart.delete({ where: { id: cartId } });
      return null;
    }

    const updated = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity },
    });

    return updated;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new Error("Failed to update cart quantity.");
  }
}

export async function removeFromCart(cartId: string) {
  try {
    await prisma.cart.delete({
      where: { id: cartId },
    });
    return true;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw new Error("Failed to remove item from cart.");
  }
}

export async function clearCart(userId: string) {
  try {
    await prisma.cart.deleteMany({
      where: { userId },
    });
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart.");
  }
}

export async function getCartCount(userId: string) {
  try {
    const count = await prisma.cart.aggregate({
      where: { userId },
      _sum: { quantity: true },
    });

    return count._sum.quantity ?? 0;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    throw new Error("Failed to fetch cart count.");
  }
}
