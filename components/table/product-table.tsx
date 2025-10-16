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
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-10">
          <div className="text-sm text-muted-foreground">
            Filter by Category
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
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
        <div className="overflow-x-auto">
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalProducts} total)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
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
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
