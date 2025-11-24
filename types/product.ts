export type Audience = "MENS" | "WOMENS" | "KIDS" | "UNISEX";
export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  audience: Audience;
  base_price: number;
  total_stock: number;
  status: string;
  images: string[];
  created_at: Date;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  productId?: string;
  product?: Product;
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
