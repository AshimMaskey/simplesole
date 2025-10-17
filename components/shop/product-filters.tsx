"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { categories, sizes, colors } from "@/lib/mock-data";
import type { Filters } from "@/types/product";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  onClose,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange
  );

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 200],
      status: [],
      sizes: [],
      colors: [],
      search: "",
      sortBy: "newest",
    });
    setPriceRange([0, 200]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-3 text-sm font-medium">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-medium">Price Range</h4>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-medium">Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-active"
                checked={filters.status.includes("active")}
                onCheckedChange={() => handleStatusToggle("active")}
              />
              <Label
                htmlFor="status-active"
                className="text-sm font-normal cursor-pointer"
              >
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-inactive"
                checked={filters.status.includes("inactive")}
                onCheckedChange={() => handleStatusToggle("inactive")}
              />
              <Label
                htmlFor="status-inactive"
                className="text-sm font-normal cursor-pointer"
              >
                Out of Stock
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-medium">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 text-sm border rounded-lg transition-all duration-200 ${
                  filters.sizes.includes(size)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-medium">Color</h4>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`relative h-10 w-10 rounded-full border-2 transition-all duration-200 ${
                  filters.colors.includes(color.name)
                    ? "border-primary scale-110"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {filters.colors.includes(color.name) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
