import type { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Air Max Velocity",
    description:
      "Premium running shoes with advanced cushioning technology for maximum comfort and performance.",
    category: "Running",
    base_price: 149.99,
    total_stock: 45,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1760199746599-12e43cbc573c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
    ],
    created_at: new Date("2024-01-15"),
    variants: [
      { id: "v1", size: "8", color: "White", stock: 10, sku: "AMV-W-8" },
      { id: "v2", size: "9", color: "White", stock: 15, sku: "AMV-W-9" },
      { id: "v3", size: "10", color: "Black", stock: 20, sku: "AMV-B-10" },
    ],
  },
  {
    id: "2",
    name: "Urban Stride",
    description:
      "Casual sneakers perfect for everyday wear with a sleek, minimalist design.",
    category: "Casual",
    base_price: 89.99,
    total_stock: 60,
    status: "active",
    images: ["/casual-gray-sneakers.jpg"],
    created_at: new Date("2024-02-01"),
    variants: [
      { id: "v4", size: "7", color: "Gray", stock: 20, sku: "US-G-7" },
      { id: "v5", size: "8", color: "Gray", stock: 25, sku: "US-G-8" },
      { id: "v6", size: "9", color: "Navy", stock: 15, sku: "US-N-9" },
    ],
  },
  {
    id: "3",
    name: "Trail Blazer Pro",
    description:
      "Rugged trail running shoes built for off-road adventures with superior grip and durability.",
    category: "Trail",
    base_price: 179.99,
    total_stock: 30,
    status: "active",
    images: ["/trail-running-shoes-brown.jpg"],
    created_at: new Date("2024-01-20"),
    variants: [
      { id: "v7", size: "9", color: "Brown", stock: 10, sku: "TBP-BR-9" },
      { id: "v8", size: "10", color: "Brown", stock: 12, sku: "TBP-BR-10" },
      { id: "v9", size: "11", color: "Green", stock: 8, sku: "TBP-G-11" },
    ],
  },
  {
    id: "4",
    name: "Court Master",
    description:
      "High-performance basketball shoes with ankle support and responsive cushioning.",
    category: "Basketball",
    base_price: 159.99,
    total_stock: 25,
    status: "active",
    images: ["/basketball-shoes-red.jpg"],
    created_at: new Date("2024-02-10"),
    variants: [
      { id: "v10", size: "10", color: "Red", stock: 8, sku: "CM-R-10" },
      { id: "v11", size: "11", color: "Red", stock: 10, sku: "CM-R-11" },
      { id: "v12", size: "12", color: "Black", stock: 7, sku: "CM-B-12" },
    ],
  },
  {
    id: "5",
    name: "Flex Runner",
    description:
      "Lightweight running shoes designed for speed and agility with breathable mesh upper.",
    category: "Running",
    base_price: 119.99,
    total_stock: 50,
    status: "active",
    images: ["/lightweight-blue-running-shoes.jpg"],
    created_at: new Date("2024-01-25"),
    variants: [
      { id: "v13", size: "8", color: "Blue", stock: 15, sku: "FR-BL-8" },
      { id: "v14", size: "9", color: "Blue", stock: 20, sku: "FR-BL-9" },
      { id: "v15", size: "10", color: "Orange", stock: 15, sku: "FR-O-10" },
    ],
  },
  {
    id: "6",
    name: "Classic Leather",
    description:
      "Timeless leather sneakers with premium craftsmanship and all-day comfort.",
    category: "Casual",
    base_price: 129.99,
    total_stock: 0,
    status: "inactive",
    images: ["/classic-white-leather-sneakers.jpg"],
    created_at: new Date("2024-02-05"),
    variants: [
      { id: "v16", size: "8", color: "White", stock: 0, sku: "CL-W-8" },
      { id: "v17", size: "9", color: "White", stock: 0, sku: "CL-W-9" },
    ],
  },
];

export const categories = ["Running", "Casual", "Trail", "Basketball"];
export const sizes = ["7", "8", "9", "10", "11", "12"];
export const colors = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Brown", hex: "#92400E" },
  { name: "Green", hex: "#166534" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Orange", hex: "#EA580C" },
];
