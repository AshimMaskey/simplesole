"use client";

import { useState, useMemo } from "react";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductModal } from "@/components/shop/product-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mockProducts } from "@/lib/mock-data";
import type { Product, ProductVariant, Filters } from "@/types/product";
import { Search, SlidersHorizontal } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Toaster } from "@/components/ui/toaster";
import toast from "react-hot-toast";
export default function ShopPage() {
  // const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 200],
    status: [],
    sizes: [],
    colors: [],
    search: "",
    sortBy: "newest",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.base_price >= filters.priceRange[0] &&
        p.base_price <= filters.priceRange[1]
    );

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((p) => filters.status.includes(p.status));
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => filters.sizes.includes(v.size))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => filters.colors.includes(v.color))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => b.created_at.getTime() - a.created_at.getTime()
        );
        break;
    }

    return filtered;
  }, [filters]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    const variantInfo = variant
      ? ` (Size: ${variant.size}, Color: ${variant.color})`
      : "";
    // toast({
    //   title: "Added to cart",
    //   description: `${product.name}${variantInfo} has been added to your cart.`,
    // });
    toast.success(`${product.name}${variantInfo} has been added to your cart.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Shop</h1>
          <p className="text-muted-foreground text-pretty">
            Discover our premium collection of performance footwear
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters({ ...filters, sortBy: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="lg:hidden bg-transparent"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <ProductFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {mockProducts.length}{" "}
              products
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
