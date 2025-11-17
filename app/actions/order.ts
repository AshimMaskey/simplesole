"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentMethod } from "@prisma/client";

export async function calculateCartTotal(userId: string) {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.variant.product.base_price * item.quantity;
    });

    // const tax = subtotal * 0.1;
    // const shipping = subtotal > 5000 ? 0 : 200;
    const tax: number = 0;
    const shipping: number = 0;

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      itemCount: cartItems.length,
    };
  } catch (error) {
    console.error("Error calculating cart total:", error);
    throw new Error("Failed to calculate cart total.");
  }
}

export async function validateStock(userId: string) {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { variant: true },
    });

    for (const item of cartItems) {
      if (item.variant.stock < item.quantity) {
        return {
          valid: false,
          message: `Insufficient stock for item`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Error validating stock:", error);
    throw new Error("Failed to validate stock.");
  }
}

// export async function createOrder(
//   userId: string,
//   formData: {
//     shippingAddress: string;
//     billingAddress?: string;
//     phone: string;
//     paymentMethod: PaymentMethod;
//     notes?: string;
//   }
// ) {
//   try {
//     // Validate stock
//     const stockValidation = await validateStock(userId);
//     if (!stockValidation.valid) {
//       throw new Error(stockValidation.message);
//     }

//     // Get cart items
//     const cartItems = await prisma.cart.findMany({
//       where: { userId },
//       include: {
//         variant: {
//           include: { product: true },
//         },
//       },
//     });

//     if (cartItems.length === 0) {
//       throw new Error("Cart is empty.");
//     }

//     // Calculate totals
//     const totals = await calculateCartTotal(userId);

//     // Create order with items in transaction
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         shippingAddress: formData.shippingAddress,
//         billingAddress: formData.billingAddress || formData.shippingAddress,
//         phone: formData.phone,
//         paymentMethod: formData.paymentMethod,
//         notes: formData.notes,
//         subtotal: totals.subtotal,
//         tax: totals.tax,
//         shipping: totals.shipping,
//         total: totals.total,
//         orderItems: {
//           create: cartItems.map((item) => ({
//             variantId: item.variantId,
//             quantity: item.quantity,
//             price: item.variant.product.base_price,
//           })),
//         },
//       },
//       include: {
//         orderItems: {
//           include: {
//             variant: {
//               include: { product: true },
//             },
//           },
//         },
//       },
//     });

//     // Update stock for each variant
//     for (const item of cartItems) {
//       await prisma.productVariant.update({
//         where: { id: item.variantId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     // Clear cart
//     await prisma.cart.deleteMany({
//       where: { userId },
//     });

//     return order;
//   } catch (error) {
//     console.error("Error creating order:", error);
//     throw new Error(
//       error instanceof Error ? error.message : "Failed to create order."
//     );
//   }
// }
export async function createOrder(
  userId: string,
  formData: {
    shippingAddress: string;
    billingAddress?: string;
    phone: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }
) {
  try {
    // Validate stock first
    const stockValidation = await validateStock(userId);
    if (!stockValidation.valid) {
      throw new Error(stockValidation.message);
    }

    // Fetch cart once
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty.");
    }

    // Calculate totals in-memory (NO extra DB hits)
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.product.base_price * item.quantity,
      0
    );

    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;

    // Run everything inside a single fast atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress || formData.shippingAddress,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          subtotal,
          tax,
          shipping,
          total,
          orderItems: {
            create: cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant.product.base_price,
            })),
          },
        },
      });

      // 2. Update stock in parallel (MUCH faster)
      await Promise.all(
        cartItems.map((item) =>
          tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      // 3. Clear cart once
      await tx.cart.deleteMany({ where: { userId } });

      return createdOrder;
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order."
    );
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function getOrderDetails(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    // Verify ownership
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to this order.");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch order details."
    );
  }
}

export async function getBasicOrder(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        total: true,
        paymentMethod: true,
        status: true,
        userId: true,
      },
    });

    if (!order) throw new Error("Order not found.");

    if (order.userId !== userId) throw new Error("Unauthorized");

    return order;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch order."
    );
  }
}

export async function getAllOrders(userRole: string) {
  try {
    if (userRole !== "ADMIN") {
      throw new Error("Unauthorized access.");
    }

    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  userRole: string
) {
  try {
    if (userRole !== "ADMIN") {
      throw new Error("Unauthorized access.");
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["PROCESSING", "CANCELED"],
      PROCESSING: ["SHIPPED", "CANCELED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELED: [],
    };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (!validTransitions[order.status as OrderStatus].includes(newStatus)) {
      throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        orderItems: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        user: true,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return updated;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update order status."
    );
  }
}

export async function getCartByUser(userId: string) {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      select: {
        id: true,
        quantity: true,
        addedAt: true,
        updatedAt: true,
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            product: {
              select: {
                id: true,
                name: true,
                base_price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return cartItems;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Failed to load cart.");
  }
}
