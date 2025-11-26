"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export interface CreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  comment?: string;
}

export interface ReviewByProduct {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    fullName: string | null;
  };
}

// CREATE a new review
export async function createReview(input: CreateReviewInput) {
  const review = await prisma.review.create({
    data: {
      productId: input.productId,
      userId: input.userId,
      rating: input.rating,
      comment: input.comment,
    },
  });

  revalidateTag("reviews");
  revalidateTag("allReviews");
  return review;
}

// READ a single review by id
export async function getReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: true,
      product: true,
    },
  });
}

// READ all reviews for a product
export const getReviewsByProduct = unstable_cache(
  async (productId: string): Promise<ReviewByProduct[]> => {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  },
  ["reviews"],
  {
    revalidate: 3600,
    tags: ["reviews"],
  }
);

// UPDATE a review
export async function updateReview(input: UpdateReviewInput) {
  const updated = await prisma.review.update({
    where: { id: input.id },
    data: {
      rating: input.rating,
      comment: input.comment,
    },
  });
  revalidateTag("reviews");
  revalidateTag("allReviews");
  return updated;
}

// DELETE a review

export async function deleteReview(id: string) {
  try {
    const deleted = await prisma.review.delete({
      where: { id },
    });
    revalidatePath("/reviews");
    revalidateTag("reviews");
    revalidateTag("allReviews");
    return deleted;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}

// OPTIONAL: Get average rating for a product
export async function getAverageRating(productId: string) {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { productId },
  });
  return result._avg.rating || 0;
}
