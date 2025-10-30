"use client";

import toast from "react-hot-toast";
import { useState, useMemo, useEffect } from "react";
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
// import { getProducts, deleteProduct }
import { getProducts, deleteProduct } from "./actions/productActions";
import { Spinner } from "@/components/ui/spinner";
// import { useToast } from "@/hooks/use-toast";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("[v0] Error loading products:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load products. Please try again.",
      //   variant: "destructive",
      // });
      toast.error("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await loadProducts();
      // toast({
      //   title: "Success",
      //   description: "Product deleted successfully.",
      // });
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("[v0] Error deleting product:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to delete product. Please try again.",
      //   variant: "destructive",
      // });
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleSaveProduct = async () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    await loadProducts();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-10" />
      </div>
    );
  }

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
