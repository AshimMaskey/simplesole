import { Product, ProductVariant } from "./product";

export type AdminUserManagement = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: "ADMIN" | "USER";
  phone: string | null;
  dob?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  memberSince: Date;
};

export type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
};

export type OrderItem = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};
