"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalProducts: number;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalProducts,
}: ProductTableProps) {
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId);
  };

  const handleConfirmDelete = () => {
    if (deleteProductId) {
      onDelete(deleteProductId);
      setDeleteProductId(null);
    }
  };

  const toggleRowExpansion = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "active" || filter === "inactive")
      return product.status === filter;
    return product.category === filter;
  });

  if (filteredProducts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          No products found. Add your first product to get started.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-center">Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const isExpanded = expandedRows.has(product.id);
                const hasVariants =
                  product.variants && product.variants.length > 0;

                return (
                  <>
                    <TableRow key={product.id}>
                      <TableCell>
                        {hasVariants && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleRowExpansion(product.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {isExpanded ? "Collapse" : "Expand"} variants
                            </span>
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        ${product.base_price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            product.total_stock === 0
                              ? "text-destructive"
                              : product.total_stock < 10
                              ? "text-orange-600"
                              : ""
                          }
                        >
                          {product.total_stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {hasVariants ? (
                          <Badge variant="outline">
                            {product.variants!.length}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit {product.name}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">
                              Delete {product.name}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && hasVariants && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-muted/50 p-0">
                          <div className="px-4 py-3">
                            <h4 className="mb-2 text-sm font-semibold">
                              Product Variants
                            </h4>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="h-8">SKU</TableHead>
                                    <TableHead className="h-8">Size</TableHead>
                                    <TableHead className="h-8">Color</TableHead>
                                    <TableHead className="h-8 text-right">
                                      Stock
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {product.variants!.map((variant) => (
                                    <TableRow key={variant.id}>
                                      <TableCell className="py-2 font-mono text-xs">
                                        {variant.sku}
                                      </TableCell>
                                      <TableCell className="py-2">
                                        {variant.size}
                                      </TableCell>
                                      <TableCell className="py-2">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="h-4 w-4 rounded-full border"
                                            style={{
                                              backgroundColor:
                                                variant.color.toLowerCase(),
                                            }}
                                          />
                                          {variant.color}
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-2 text-right">
                                        <span
                                          className={
                                            variant.stock === 0
                                              ? "text-destructive"
                                              : variant.stock < 5
                                              ? "text-orange-600"
                                              : ""
                                          }
                                        >
                                          {variant.stock}
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y">
          {filteredProducts.map((product) => {
            const isExpanded = expandedRows.has(product.id);
            const hasVariants = product.variants && product.variants.length > 0;

            return (
              <div key={product.id} className="p-4 space-y-4">
                {/* Product Header */}
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-base line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit {product.name}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete {product.name}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-medium">
                      ${product.base_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <p
                      className={`font-medium ${
                        product.total_stock === 0
                          ? "text-destructive"
                          : product.total_stock < 10
                          ? "text-orange-600"
                          : ""
                      }`}
                    >
                      {product.total_stock}
                    </p>
                  </div>
                  {hasVariants && (
                    <div>
                      <span className="text-muted-foreground">Variants:</span>
                      <p className="font-medium">{product.variants!.length}</p>
                    </div>
                  )}
                </div>

                {/* Variants Toggle */}
                {hasVariants && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleRowExpansion(product.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Hide Variants
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4 mr-2" />
                          Show Variants ({product.variants!.length})
                        </>
                      )}
                    </Button>

                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-semibold">Variants</h4>
                        <div className="space-y-3">
                          {product.variants!.map((variant) => (
                            <div
                              key={variant.id}
                              className="bg-muted/50 rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">
                                  {variant.sku}
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    variant.stock === 0
                                      ? "text-destructive"
                                      : variant.stock < 5
                                      ? "text-orange-600"
                                      : ""
                                  }`}
                                >
                                  Stock: {variant.stock}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Size:
                                  </span>{" "}
                                  {variant.size}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    Color:
                                  </span>
                                  <div
                                    className="h-4 w-4 rounded-full border"
                                    style={{
                                      backgroundColor:
                                        variant.color.toLowerCase(),
                                    }}
                                  />
                                  {variant.color}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex flex-col gap-4 p-4 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Rows per page:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                Page {currentPage} of {totalPages} ({totalProducts} total)
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteProductId !== null}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <span className="text-white">Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
