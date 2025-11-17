"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Star, Trash2 } from "lucide-react";
import { deleteReview, ReviewByProduct } from "../actions/reviews";
import { useUser } from "@clerk/nextjs";
import { ReviewDialog } from "@/components/dialog/review-dialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";

interface TabsSectionProps {
  description: string | null;
  reviews: ReviewByProduct[];
  productId: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const REVIEWS_PER_PAGE = 5;

const TabsSection = ({ description, reviews, productId }: TabsSectionProps) => {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirm) return;

    try {
      setIsDeleting(id);
      await deleteReview(id);
      toast.success("Review deleted successfully!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-15">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex w-full border rounded-lg border-gray-200 mb-8">
          <TabsTrigger
            value="description"
            className="flex-1 cursor-pointer px-6 py-4 font-semibold text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all duration-200 hover:text-gray-900"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 cursor-pointer px-6 py-4 font-semibold text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all duration-200 hover:text-gray-900 flex items-center justify-center gap-2"
          >
            Reviews
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full min-w-6">
              {reviews.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* DESCRIPTION */}
        <TabsContent value="description" className="focus:outline-none">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Product Details
            </h3>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg md:text-lg">
              {description ||
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti nam deleniti natus nesciunt maiores, harum illo dolorem fugiat quibusdam fuga?"}
            </p>
            <ul className="space-y-3 md:space-y-4 list-disc pl-5 text-gray-700 text-base sm:text-lg">
              <li>Premium quality materials</li>
              <li>Eco-friendly manufacturing process</li>
              <li>2-year warranty included</li>
              <li>Easy maintenance and care</li>
            </ul>
          </div>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews" className="focus:outline-none">
          <div className="space-y-8">
            {reviews.length > 0 && (
              <div className="flex flex-col md:flex-row items-center md:items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={Math.round(averageRating)} />
                  <div className="text-sm text-gray-600 mt-1">
                    {reviews.length} reviews
                  </div>
                  <div className="mt-4 md:mt-4">
                    <ReviewDialog
                      productId={productId}
                      onSuccess={() => {
                        router.refresh();
                      }}
                      triggerLabel="Add Review"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(
                        (r) => r.rating === rating
                      ).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div
                          key={rating}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-8 text-gray-600">{rating}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-gray-600 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.user.fullName || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {review.user.id.trim() ==
                      (clerkUser?.id || "placeholder") && (
                      <div className="flex gap-1">
                        <ReviewDialog
                          productId={productId}
                          initialData={review}
                          onSuccess={() => router.refresh()}
                          triggerLabel={"Edit Review"}
                        />
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting === review.id}
                          className="text-gray-500 cursor-pointer p-2 hover:bg-red-100 rounded-xl hover:text-red-600 transition-colors"
                        >
                          {isDeleting === review.id ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {reviews.length > REVIEWS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}

            {reviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to share your thoughts!
                </p>
                <div className="w-full flex justify-center mt-3">
                  <ReviewDialog
                    productId={productId}
                    onSuccess={() => {
                      router.refresh();
                    }}
                    triggerLabel="Add Review"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsSection;
