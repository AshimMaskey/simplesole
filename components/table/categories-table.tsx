"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Search,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Plus,
  Edit2,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

type SortKey = "name" | "createdAt";
type SortOrder = "asc" | "desc";

// API calls
const fetchCategories = async () => {
  const res = await fetch("/api/category");
  return res.json();
};

const createCategory = async (name: string) => {
  const res = await fetch("/api/category", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return res.json();
};

const updateCategory = async (id: string, name: string) => {
  const res = await fetch("/api/category", {
    method: "PUT",
    body: JSON.stringify({ id, name }),
  });
  return res.json();
};

const deleteCategory = async (id: string) => {
  const res = await fetch("/api/category", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res.json();
};

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch categories on mount and after changes
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filtered and searched categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Sorted categories
  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
      const aValue: string | number =
        sortKey === "createdAt" ? new Date(a.createdAt).getTime() : a.name;
      const bValue: string | number =
        sortKey === "createdAt" ? new Date(b.createdAt).getTime() : b.name;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCategories, sortKey, sortOrder]);

  // Paginated categories
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCategories.slice(start, start + pageSize);
  }, [sortedCategories, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCategories.length / pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // CRUD handlers
  const handleCreate = async () => {
    if (!newCategoryName.trim()) return toast.error("Name required");
    setIsCreating(true);
    try {
      const result = await createCategory(newCategoryName);
      if (result.success) {
        toast.success("Category created");
        setNewCategoryName("");
        setIsCreateOpen(false);
        loadCategories();
      } else toast.error(result.error || "Failed to create");
    } catch (error) {
      toast.error("Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return toast.error("Name required");
    setIsEditing(true);
    try {
      const result = await updateCategory(editingId, editName);
      if (result.success) {
        toast.success("Category updated");

        // Close the dialog
        setEditingId(null);
        setEditName("");

        // Refresh categories
        await loadCategories();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const result = await deleteCategory(deleteId);
      if (result.success) {
        toast.success("Category deleted");
        setDeleteId(null);
        loadCategories();
      } else toast.error(result.error || "Failed to delete");
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <div className="w-4 h-4" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search + Create */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 py-5"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Enter a name</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name <SortIcon column="name" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-2">
                    Created <SortIcon column="createdAt" />
                  </div>
                </TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center flex justify-center gap-2">
                      <Dialog
                        open={editingId === category.id}
                        onOpenChange={(open) => !open && setEditingId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(category.id);
                              setEditName(category.name);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Update the name
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") handleUpdate();
                              }}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditName("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdate}
                                disabled={isEditing}
                              >
                                {isEditing ? "Updating..." : "Update"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(category.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y">
          {paginatedCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found
            </div>
          ) : (
            paginatedCategories.map((category, index) => (
              <div key={category.id} className="p-4 space-y-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      #{(currentPage - 1) * pageSize + index + 1}
                    </span>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(category.id);
                            setEditName(category.name);
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>Update the name</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleUpdate();
                            }}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditName("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleUpdate} disabled={isEditing}>
                              {isEditing ? "Updating..." : "Update"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteId(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setCurrentPage(1);
              }}
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
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1} ({sortedCategories.length}{" "}
            total)
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
