import type { CartItem, WishlistItem } from "@/types/product";
import { mockProducts } from "./mock-data";

// Mock cart items for demonstration
export const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    product: mockProducts[0], // Air Max Velocity
    variant: mockProducts[0].variants![0], // White, Size 8
    quantity: 1,
  },
  {
    id: "cart-2",
    product: mockProducts[1], // Urban Stride
    variant: mockProducts[1].variants![1], // Gray, Size 8
    quantity: 2,
  },
  {
    id: "cart-3",
    product: mockProducts[4], // Flex Runner
    variant: mockProducts[4].variants![0], // Blue, Size 8
    quantity: 1,
  },
];

// Mock wishlist items for demonstration
export const mockWishlistItems: WishlistItem[] = [
  {
    id: "wish-1",
    product: mockProducts[2], // Trail Blazer Pro
    addedAt: new Date("2024-03-01"),
  },
  {
    id: "wish-2",
    product: mockProducts[3], // Court Master
    addedAt: new Date("2024-03-05"),
  },
  {
    id: "wish-3",
    product: mockProducts[5], // Classic Leather
    addedAt: new Date("2024-03-10"),
  },
];
