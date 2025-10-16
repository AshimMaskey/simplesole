"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Check,
  X,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type ReviewsTableProps = {
  reviews: Review[];
};

type SortField =
  | "product_name"
  | "user_name"
  | "rating"
  | "status"
  | "created_at";
type SortDirection = "asc" | "desc" | null;

export function ReviewsTable({ reviews: initialReviews }: ReviewsTableProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{
    type: "approve" | "reject" | "delete";
    reviewId: string | null;
  }>({ type: "approve", reviewId: null });

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        review.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.user_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  const sortedReviews = useMemo(() => {
    if (!sortDirection) return filteredReviews;

    return [...filteredReviews].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (!aValue) return 1;
      if (!bValue) return -1;

      if (sortField === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredReviews, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedReviews.length / pageSize);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedReviews.slice(startIndex, startIndex + pageSize);
  }, [sortedReviews, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(paginatedReviews.map((r) => r.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews([...selectedReviews, reviewId]);
    } else {
      setSelectedReviews(selectedReviews.filter((id) => id !== reviewId));
    }
  };

  const openDialog = (
    type: "approve" | "reject" | "delete",
    reviewId: string
  ) => {
    setDialogAction({ type, reviewId });
    setDialogOpen(true);
  };

  const handleAction = () => {
    const { type, reviewId } = dialogAction;

    if (reviewId) {
      setReviews(
        reviews
          .map((review) => {
            if (review.id === reviewId) {
              if (type === "delete") {
                return null;
              }
              return {
                ...review,
                status:
                  type === "approve"
                    ? ("approved" as const)
                    : ("rejected" as const),
              };
            }
            return review;
          })
          .filter(Boolean) as Review[]
      );

      toast.success(`Review ${type}d`, {
        description: `The review has been ${type}d successfully.`,
      });
    }

    setDialogOpen(false);
  };

  const handleBulkAction = (type: "approve" | "reject" | "delete") => {
    if (selectedReviews.length === 0) return;

    setReviews(
      reviews
        .map((review) => {
          if (selectedReviews.includes(review.id)) {
            if (type === "delete") {
              return null;
            }
            return {
              ...review,
              status:
                type === "approve"
                  ? ("approved" as const)
                  : ("rejected" as const),
            };
          }
          return review;
        })
        .filter(Boolean) as Review[]
    );

    toast.success("Bulk action completed", {
      description: `${selectedReviews.length} review(s) ${type}d successfully.`,
    });

    setSelectedReviews([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-warning text-warning"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: Review["status"]) => {
    const variants = {
      approved: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge
        variant="outline"
        className={`${variants[status]} capitalize font-medium`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product or user name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {selectedReviews.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedReviews.length} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("approve")}
                  className="border-success/20 text-success hover:bg-success/10"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("reject")}
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedReviews.length === paginatedReviews.length &&
                        paginatedReviews.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("product_name")}
                      className="h-8 px-2 lg:px-3"
                    >
                      Product Name
                      {getSortIcon("product_name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("user_name")}
                      className="h-8 px-2 lg:px-3"
                    >
                      User Name
                      {getSortIcon("user_name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("rating")}
                      className="h-8 px-2 lg:px-3"
                    >
                      Rating
                      {getSortIcon("rating")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[300px]">Comment</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-8 px-2 lg:px-3"
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("created_at")}
                      className="h-8 px-2 lg:px-3"
                    >
                      Created At
                      {getSortIcon("created_at")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReviews.includes(review.id)}
                          onCheckedChange={(checked) =>
                            handleSelectReview(review.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {review.product_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {review.user_name}
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {truncateText(review.comment, 80)}
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(review.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDialog("approve", review.id)}
                            className="h-8 px-2 text-success hover:bg-success/10 hover:text-success"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDialog("reject", review.id)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDialog("delete", review.id)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1} ({sortedReviews.length}{" "}
                total)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Confirm {dialogAction.type}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to {dialogAction.type} this review? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={
                dialogAction.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            >
              {dialogAction.type === "approve" && "Approve"}
              {dialogAction.type === "reject" && "Reject"}
              {dialogAction.type === "delete" && "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
