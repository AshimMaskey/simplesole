"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "@/components/men/product-card";
import Image from "next/image";

export interface MensProductProps {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  base_price: number;
}
export interface MensProductsPageProps {
  products: MensProductProps[];
  bannerInfo: {
    title: string;
    desc: string;
    imageUrl: string;
  };
}

type SortOption = "newest" | "price-low" | "price-high";

export default function MensProductsPage({
  products,
  bannerInfo,
}: MensProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.base_price - b.base_price;
      if (sortBy === "price-high") return b.base_price - a.base_price;
      return 0;
    });

    return sorted;
  }, [searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative w-full h-96 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
        <Image
          width={400}
          height={400}
          src={bannerInfo.imageUrl}
          alt="Men's Collection Banner"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            {bannerInfo.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-light">
            {bannerInfo.desc}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search products..."
                className="pl-10 py-2.5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedProducts.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
