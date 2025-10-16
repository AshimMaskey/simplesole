"use client";

import { ReviewsTable } from "@/components/table/reviews-table";

// Mock data for reviews
const mockReviews = [
  {
    id: "1",
    product_name: "Air Max Pro 2024",
    user_name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely love these shoes! The comfort is unmatched and they look amazing. Perfect for both running and casual wear.",
    status: "approved" as const,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    product_name: "Urban Runner Elite",
    user_name: "Mike Chen",
    rating: 4,
    comment:
      "Great quality and design. Only minor issue is they run slightly small, so I'd recommend sizing up.",
    status: "pending" as const,
    created_at: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    product_name: "Classic Leather Low",
    user_name: "Emma Davis",
    rating: 2,
    comment:
      "Not what I expected. The leather quality feels cheap and started creasing after just one wear.",
    status: "pending" as const,
    created_at: "2024-01-14T09:20:00Z",
  },
  {
    id: "4",
    product_name: "Sport Flex 360",
    user_name: "James Wilson",
    rating: 5,
    comment:
      "Best athletic shoes I've ever owned. The flexibility and support are incredible for training.",
    status: "approved" as const,
    created_at: "2024-01-13T14:10:00Z",
  },
  {
    id: "5",
    product_name: "Street Style High",
    user_name: "Lisa Anderson",
    rating: 1,
    comment:
      "Terrible experience. Shoes fell apart after two weeks. Would not recommend to anyone.",
    status: "rejected" as const,
    created_at: "2024-01-13T11:30:00Z",
  },
  {
    id: "6",
    product_name: "Comfort Walk Plus",
    user_name: "David Martinez",
    rating: 4,
    comment:
      "Very comfortable for all-day wear. Good arch support and cushioning. Worth the price.",
    status: "approved" as const,
    created_at: "2024-01-12T16:20:00Z",
  },
  {
    id: "7",
    product_name: "Trail Blazer X",
    user_name: "Rachel Kim",
    rating: 3,
    comment:
      "Decent shoes but nothing special. They do the job but I expected more for the price point.",
    status: "pending" as const,
    created_at: "2024-01-12T08:45:00Z",
  },
  {
    id: "8",
    product_name: "Air Max Pro 2024",
    user_name: "Tom Brown",
    rating: 5,
    comment:
      "Outstanding! The design is sleek and modern. They're incredibly lightweight yet durable.",
    status: "approved" as const,
    created_at: "2024-01-11T13:15:00Z",
  },
];

export default function ReviewManagementPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Review Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and moderate customer reviews for your products
          </p>
        </div>

        {/* Reviews Table */}
        <ReviewsTable reviews={mockReviews} />
      </div>
    </div>
  );
}
