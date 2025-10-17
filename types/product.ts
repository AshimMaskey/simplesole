// export interface ProductVariant {
//   id: string;
//   size: string;
//   color: string;
//   stock: number;
//   sku: string;
// }

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   base_price: number;
//   total_stock: number;
//   status: "active" | "inactive";
//   images: string[];
//   created_at: string;
//   variants?: ProductVariant[];
// }
export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  total_stock: number;
  status: string; // "active" | "inactive"
  images: string[];
  created_at: Date;
  variants?: ProductVariant[]; // optional when fetching with `include`
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  productId?: string; // foreign key
  product?: Product; // optional, only included if `include: { product: true }`
};

export type Filters = {
  categories: string[];
  priceRange: [number, number];
  status: string[];
  sizes: string[];
  colors: string[];
  search: string;
  sortBy: string;
};

export type CartItem = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export type WishlistItem = {
  id: string;
  product: Product;
  addedAt: Date;
};
