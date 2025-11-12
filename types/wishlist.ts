export interface WishlistByUserItem {
  id: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    base_price: number;
    total_stock: number;
    images: string[];
  };
}
