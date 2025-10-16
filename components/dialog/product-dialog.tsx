"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import type { Product, ProductVariant } from "@/types/product";
// import { saveProduct } from "@/actions/save-product";
import { saveProduct } from "@/app/(admin)/products/actions/productActions";
// import { useToast } from "@/hooks/use-toast";
import toast from "react-hot-toast";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: () => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "Running",
    base_price: 0,
    total_stock: 0,
    status: "active",
    images: [],
    variants: [],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    size: "",
    color: "",
    stock: 0,
    sku: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "Running",
        base_price: 0,
        total_stock: 0,
        status: "active",
        images: [],
        variants: [],
      });
    }
  }, [product, open]);

  useEffect(() => {
    if (formData.variants && formData.variants.length > 0) {
      const totalStock = formData.variants.reduce(
        (sum, variant) => sum + variant.stock,
        0
      );
      setFormData((prev) => ({ ...prev, total_stock: totalStock }));
    }
  }, [formData.variants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await saveProduct(formData as Product & { variants?: ProductVariant[] });
      // toast({
      //   title: "Success",
      //   description: product
      //     ? "Product updated successfully."
      //     : "Product added successfully.",
      // });
      if (product) {
        toast.success("Product updated successfully.");
      } else {
        toast.success("Product added successfully.");
      }
      onSave();
    } catch (error) {
      console.error("[v0] Error saving product:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to save product. Please try again.",
      //   variant: "destructive",
      // });
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index) || [],
    });
  };

  const handleAddVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.sku) {
      const variant: ProductVariant = {
        id: Date.now().toString(),
        size: newVariant.size,
        color: newVariant.color,
        stock: newVariant.stock || 0,
        sku: newVariant.sku,
      };
      setFormData({
        ...formData,
        variants: [...(formData.variants || []), variant],
      });
      setNewVariant({ size: "", color: "", stock: 0, sku: "" });
    }
  };

  const handleRemoveVariant = (variantId: string) => {
    setFormData({
      ...formData,
      variants: formData.variants?.filter((v) => v.id !== variantId) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Fill in the details to add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 pt-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Air Max 270"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the product features and benefits..."
                  rows={3}
                  required
                />
              </div>

              {/* Category and Status Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Running">Running</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Trail">Trail</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    Status
                  </Label>
                  <div className="flex h-10 items-center gap-3 rounded-md border border-input bg-background px-3">
                    <Switch
                      id="status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          status: checked ? "active" : "inactive",
                        })
                      }
                    />
                    <span className="text-sm">
                      {formData.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Stock Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_price: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Total Stock
                    {formData.variants && formData.variants.length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Auto-calculated from variants)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.total_stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_stock: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    disabled={formData.variants && formData.variants.length > 0}
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddImage}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Preview */}
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="group relative h-20 w-20 overflow-hidden rounded-md border"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3 text-destructive-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    Add Product Variants
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Define different sizes, colors, and stock levels for this
                    product
                  </p>
                </div>

                {/* Add Variant Form */}
                <Card className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="variant-size">Size</Label>
                      <Input
                        id="variant-size"
                        value={newVariant.size}
                        onChange={(e) =>
                          setNewVariant({ ...newVariant, size: e.target.value })
                        }
                        placeholder="e.g., 10, M, L"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-color">Color</Label>
                      <Input
                        id="variant-color"
                        value={newVariant.color}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            color: e.target.value,
                          })
                        }
                        placeholder="e.g., Black, Red"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-sku">SKU</Label>
                      <Input
                        id="variant-sku"
                        value={newVariant.sku}
                        onChange={(e) =>
                          setNewVariant({ ...newVariant, sku: e.target.value })
                        }
                        placeholder="e.g., AM270-BLK-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-stock">Stock</Label>
                      <Input
                        id="variant-stock"
                        type="number"
                        min="0"
                        value={newVariant.stock}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            stock: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-4 w-full bg-transparent"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </Card>

                {/* Variants List */}
                {formData.variants && formData.variants.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Variants ({formData.variants.length})</Label>
                    <div className="space-y-2">
                      {formData.variants.map((variant) => (
                        <Card
                          key={variant.id}
                          className="flex items-center justify-between p-3"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="h-6 w-6 rounded-full border"
                              style={{
                                backgroundColor: variant.color.toLowerCase(),
                              }}
                            />
                            <div className="text-sm">
                              <div className="font-medium">
                                {variant.color} - Size {variant.size}
                              </div>
                              <div className="text-muted-foreground">
                                SKU: {variant.sku} • Stock: {variant.stock}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVariant(variant.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : product
                ? "Update Product"
                : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
