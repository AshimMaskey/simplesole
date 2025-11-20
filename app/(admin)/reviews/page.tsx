import { Suspense } from "react";
import { ReviewsTable } from "@/components/table/reviews-table";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { MarkSeenClient } from "./MarkSeenClient";

const getReviews = unstable_cache(
  async () => {
    return prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["allReviews"],
  {
    revalidate: 3600,
    tags: ["allReviews"],
  }
);

function ReviewsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-muted rounded-lg animate-pulse" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <>
      {" "}
      <MarkSeenClient />
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-3xl mb-3 font-semibold">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage and view all reviews in your ecommerce shoe store
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-3xl font-bold mt-2">{reviews.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <p className="text-3xl font-bold mt-2">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0"}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">5 Star Reviews</p>
            <p className="text-3xl font-bold mt-2">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">1 Star Reviews</p>
            <p className="text-3xl font-bold mt-2">
              {reviews.filter((r) => r.rating === 1).length}
            </p>
          </Card>
        </div>

        <Suspense fallback={<ReviewsLoadingSkeleton />}>
          <ReviewsTable reviews={reviews} key={Date.now()} />
        </Suspense>
      </div>
    </>
  );
}
