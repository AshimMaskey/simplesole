export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  base_price: number;
  total_stock: number;
  status: string;
  images: string[];
  created_at: Date;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  productId: string;
  product: Product;
}

export interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  addedAt: Date;
  updatedAt: Date;
  variant: ProductVariant;
}
