"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/product-card";
import { ProductModal } from "@/components/shop/product-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";
import type { Product, ProductVariant } from "@/types/product";
import { Search, X, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.base_price - b.base_price);
        break;
      case "price-high":
        results.sort((a, b) => b.base_price - a.base_price);
        break;
      case "newest":
        results.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        break;
      case "relevance":
      default:
        // Sort by relevance (name match > description match)
        results.sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(query) ? 1 : 0;
          const bNameMatch = b.name.toLowerCase().includes(query) ? 1 : 0;
          return bNameMatch - aNameMatch;
        });
        break;
    }

    return results;
  }, [searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive, form submission just focuses out
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    const variantInfo = variant
      ? ` (Size: ${variant.size}, Color: ${variant.color})`
      : "";

    toast.success(`${product.name}${variantInfo} has been added to your cart.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-balance">Search</h1>
            <p className="text-muted-foreground text-pretty">
              Find your perfect pair from our collection
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for shoes by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Search Info Bar */}
          {searchQuery && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "result" : "results"} for
                </span>
                <Badge variant="secondary" className="text-sm">
                  {searchQuery}
                  <button
                    onClick={handleClearSearch}
                    className="ml-2 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>

              {searchResults.length > 0 && (
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        {!searchQuery ? (
          // Empty State - No Search Query
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Start your search</h2>
            <p className="text-muted-foreground max-w-md text-pretty">
              Enter a product name, category, or description to find what
              you&apos;re looking for
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          // Empty State - No Results
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-md mb-6 text-pretty">
              We couldn&apos;t find any products matching &quot;{searchQuery}
              &quot;. Try different keywords or browse our categories.
            </p>
            <Button onClick={handleClearSearch} variant="outline">
              Clear search
            </Button>
          </div>
        ) : (
          // Results Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
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
