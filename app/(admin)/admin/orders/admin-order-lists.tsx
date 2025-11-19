"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Audience, OrderStatus, PaymentMethod, Role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";

export interface AllOrdersResponse {
  id: string;
  userId: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  billingAddress: string | null;
  phone: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  user: {
    id: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    image_url: string | null;
    role: Role;
  };

  orderItems: {
    id: string;
    quantity: number;
    price: number;
    createdAt: Date;

    variant: {
      id: string;
      size: string;
      color: string;
      stock: number;
      sku: string;

      product: {
        id: string;
        name: string;
        description: string | null;
        category: string;
        audience: Audience;
        base_price: number;
        total_stock: number;
        status: string;
        views: number;
        images: string[];
        created_at: Date;
      };
    };
  }[];
}

interface AdminOrdersListProps {
  orders: AllOrdersResponse[];
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

type SortField = "id" | "user.fullName" | "total" | "status" | "createdAt";
type SortDirection = "asc" | "desc" | null;

export default function AdminOrdersList({
  orders: initialOrders,
}: AdminOrdersListProps) {
  const [orders] = useState<AllOrdersResponse[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.user.fullName?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (order.user.email?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        );
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentMethod === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const sortedOrders = useMemo(() => {
    if (!sortDirection) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === "user.fullName") {
        aValue = a.user.fullName || "";
        bValue = b.user.fullName || "";
      } else {
        aValue = a[sortField as keyof AllOrdersResponse];
        bValue = b[sortField as keyof AllOrdersResponse];
      }

      if (!aValue) return 1;
      if (!bValue) return -1;

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      else return aValue < bValue ? 1 : -1;
    });
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedOrders.slice(startIndex, startIndex + pageSize);
  }, [sortedOrders, currentPage, pageSize]);

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

  function formatDate(date: string | Date | null | undefined) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 py-5"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full py-5 sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={paymentFilter}
          onValueChange={(value) => {
            setPaymentFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full py-5 sm:w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pay Methods</SelectItem>
            <SelectItem value="COD">Cash on Delivery</SelectItem>
            <SelectItem value="ESEWA">Esewa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0 flex flex-col w-full overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">SN</TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="h-8 px-2 lg:px-3"
                  >
                    Order ID {getSortIcon("id")}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("user.fullName")}
                    className="h-8 px-2 lg:px-3"
                  >
                    Customer {getSortIcon("user.fullName")}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("total")}
                    className="h-8 px-2 lg:px-3"
                  >
                    Total {getSortIcon("total")}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-8 px-2 lg:px-3"
                  >
                    Status {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">Payment</TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="h-8 px-2 lg:px-3"
                  >
                    Date {getSortIcon("createdAt")}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="whitespace-nowrap">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {order.user.fullName || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="max-w-[200px] truncate">
                        {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">
                      Rs. {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        className={
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="lg:hidden divide-y">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          ) : (
            paginatedOrders.map((order, index) => (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        #{(currentPage - 1) * pageSize + index + 1}
                      </span>
                      <Badge
                        className={
                          statusColors[
                            order.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-base truncate">
                      {order.user.fullName || "N/A"}
                    </p>
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button size="sm" className="shrink-0">
                      View
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[60px]">
                      Order ID:
                    </span>
                    <span className="font-mono text-xs">
                      {order.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[60px]">
                      Email:
                    </span>
                    <span className="break-all text-xs">
                      {order.user.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[60px]">
                      Total:
                    </span>
                    <span className="font-semibold">
                      Rs. {order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[60px]">
                      Payment:
                    </span>
                    <span className="text-xs">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[60px]">
                      Date:
                    </span>
                    <span className="text-xs">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-4 p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
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

            <div className="text-sm text-muted-foreground text-center">
              Page {currentPage} of {totalPages || 1} ({sortedOrders.length}{" "}
              total)
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
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
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
