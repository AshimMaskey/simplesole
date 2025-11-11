"use server";

import { prisma } from "@/lib/prisma";

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
export async function getReviewsByProduct(
  productId: string
): Promise<ReviewByProduct[]> {
  console.log(productId);
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(reviews);
  return reviews;
}

// UPDATE a review
export async function updateReview(input: UpdateReviewInput) {
  return prisma.review.update({
    where: { id: input.id },
    data: {
      rating: input.rating,
      comment: input.comment,
    },
  });
}

// DELETE a review
export async function deleteReview(id: string) {
  return prisma.review.delete({
    where: { id },
  });
}

// OPTIONAL: Get average rating for a product
export async function getAverageRating(productId: string) {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { productId },
  });
  return result._avg.rating || 0;
}
