"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductTable } from "@/components/table/product-table";
import { ProductDialog } from "@/components/dialog/product-dialog";
import type { Product } from "@/types/product";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Air Max 270",
    description: "Comfortable running shoes with air cushioning technology",
    category: "Running",
    base_price: 149.99,
    total_stock: 45,
    status: "active",
    images: ["/nike-air-max-270.png"],
    created_at: "2024-01-15T10:00:00Z",
    variants: [
      { id: "v1", size: "9", color: "Black", stock: 15, sku: "AM270-BLK-9" },
      { id: "v2", size: "10", color: "Black", stock: 20, sku: "AM270-BLK-10" },
      { id: "v3", size: "11", color: "White", stock: 10, sku: "AM270-WHT-11" },
    ],
  },
  {
    id: "2",
    name: "Classic Leather Sneaker",
    description: "Timeless leather sneakers for everyday wear",
    category: "Casual",
    base_price: 89.99,
    total_stock: 120,
    status: "active",
    images: ["/leather-sneaker.jpg"],
    created_at: "2024-01-20T14:30:00Z",
    variants: [
      { id: "v4", size: "8", color: "Brown", stock: 30, sku: "CLS-BRN-8" },
      { id: "v5", size: "9", color: "Brown", stock: 40, sku: "CLS-BRN-9" },
      { id: "v6", size: "10", color: "Black", stock: 50, sku: "CLS-BLK-10" },
    ],
  },
  {
    id: "3",
    name: "Trail Runner Pro",
    description: "Durable trail running shoes with enhanced grip",
    category: "Trail",
    base_price: 179.99,
    total_stock: 0,
    status: "inactive",
    images: ["/trail-running-shoes.jpg"],
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    name: "Basketball Elite",
    description: "High-performance basketball shoes with ankle support",
    category: "Basketball",
    base_price: 199.99,
    total_stock: 32,
    status: "active",
    images: ["/athletic-basketball-shoes.png"],
    created_at: "2024-02-10T16:45:00Z",
    variants: [
      { id: "v7", size: "10", color: "Red", stock: 12, sku: "BBE-RED-10" },
      { id: "v8", size: "11", color: "Blue", stock: 20, sku: "BBE-BLU-11" },
    ],
  },
  {
    id: "5",
    name: "Minimalist Runner",
    description: "Lightweight minimalist running shoes",
    category: "Running",
    base_price: 119.99,
    total_stock: 8,
    status: "active",
    images: ["/minimalist-running-shoes.jpg"],
    created_at: "2024-02-15T11:20:00Z",
    variants: [
      { id: "v9", size: "9", color: "Gray", stock: 3, sku: "MR-GRY-9" },
      { id: "v10", size: "10", color: "Gray", stock: 5, sku: "MR-GRY-10" },
    ],
  },
  {
    id: "6",
    name: "Urban Street Sneaker",
    description: "Stylish street-style sneakers for urban fashion",
    category: "Casual",
    base_price: 99.99,
    total_stock: 65,
    status: "active",
    images: ["/urban-street-sneaker.jpg"],
    created_at: "2024-02-20T13:30:00Z",
    variants: [
      { id: "v11", size: "8", color: "White", stock: 25, sku: "USS-WHT-8" },
      { id: "v12", size: "9", color: "Black", stock: 40, sku: "USS-BLK-9" },
    ],
  },
  {
    id: "7",
    name: "Performance Training Shoe",
    description: "Cross-training shoes for gym and fitness",
    category: "Training",
    base_price: 129.99,
    total_stock: 88,
    status: "active",
    images: ["/athletic-training-shoes.png"],
    created_at: "2024-02-25T10:00:00Z",
    variants: [
      { id: "v13", size: "9", color: "Blue", stock: 30, sku: "PTS-BLU-9" },
      { id: "v14", size: "10", color: "Red", stock: 28, sku: "PTS-RED-10" },
      { id: "v15", size: "11", color: "Black", stock: 30, sku: "PTS-BLK-11" },
    ],
  },
  {
    id: "8",
    name: "Hiking Boot Pro",
    description: "Waterproof hiking boots for outdoor adventures",
    category: "Hiking",
    base_price: 189.99,
    total_stock: 42,
    status: "active",
    images: ["/hiking-boots-close-up.png"],
    created_at: "2024-03-01T08:45:00Z",
    variants: [
      { id: "v16", size: "9", color: "Brown", stock: 15, sku: "HBP-BRN-9" },
      { id: "v17", size: "10", color: "Brown", stock: 27, sku: "HBP-BRN-10" },
    ],
  },
  {
    id: "9",
    name: "Soccer Cleat Elite",
    description: "Professional soccer cleats with superior grip",
    category: "Soccer",
    base_price: 159.99,
    total_stock: 0,
    status: "inactive",
    images: ["/soccer-cleats.jpg"],
    created_at: "2024-03-05T15:20:00Z",
  },
  {
    id: "10",
    name: "Slip-On Comfort",
    description: "Easy slip-on shoes for casual comfort",
    category: "Casual",
    base_price: 69.99,
    total_stock: 95,
    status: "active",
    images: ["/slip-on-shoes.jpg"],
    created_at: "2024-03-10T11:00:00Z",
    variants: [
      { id: "v18", size: "8", color: "Navy", stock: 35, sku: "SOC-NAV-8" },
      { id: "v19", size: "9", color: "Gray", stock: 30, sku: "SOC-GRY-9" },
      { id: "v20", size: "10", color: "Black", stock: 30, sku: "SOC-BLK-10" },
    ],
  },
  {
    id: "11",
    name: "Marathon Runner",
    description: "Long-distance running shoes with maximum cushioning",
    category: "Running",
    base_price: 169.99,
    total_stock: 54,
    status: "active",
    images: ["/marathon-running-shoes.jpg"],
    created_at: "2024-03-15T09:30:00Z",
    variants: [
      { id: "v21", size: "9", color: "Orange", stock: 18, sku: "MR-ORG-9" },
      { id: "v22", size: "10", color: "Blue", stock: 20, sku: "MR-BLU-10" },
      { id: "v23", size: "11", color: "Green", stock: 16, sku: "MR-GRN-11" },
    ],
  },
  {
    id: "12",
    name: "Tennis Court Pro",
    description: "Professional tennis shoes with lateral support",
    category: "Tennis",
    base_price: 139.99,
    total_stock: 6,
    status: "active",
    images: ["/colorful-tennis-shoes.png"],
    created_at: "2024-03-20T14:15:00Z",
    variants: [
      { id: "v24", size: "9", color: "White", stock: 3, sku: "TCP-WHT-9" },
      { id: "v25", size: "10", color: "White", stock: 3, sku: "TCP-WHT-10" },
    ],
  },
];

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (filterBy === "all") return matchesSearch;

      if (filterBy === "active" || filterBy === "inactive") {
        return matchesSearch && product.status === filterBy;
      }

      return matchesSearch && product.category === filterBy;
    });
  }, [products, searchQuery, filterBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl mb-3 font-semibold">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your shoe inventory and product catalog
            </p>
          </div>
          <Button onClick={handleAddProduct} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 bg-white rounded-2xl p-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterBy} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Trail">Trail</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Hiking">Hiking</SelectItem>
              <SelectItem value="Soccer">Soccer</SelectItem>
              <SelectItem value="Tennis">Tennis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Table */}
        <ProductTable
          products={paginatedProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalProducts={filteredProducts.length}
        />

        {/* Product Dialog */}
        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      </div>
    </div>
  );
}
