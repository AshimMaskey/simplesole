"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Edit2, Star } from "lucide-react";
import {
  createReview,
  updateReview,
  ReviewByProduct,
} from "@/app/(users)/products/actions/reviews";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
  productId: string;
  initialData?: ReviewByProduct;
  onSuccess: () => void;
  triggerLabel?: string;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  productId,
  initialData,
  onSuccess,
  triggerLabel,
}) => {
  const isEdit = !!initialData;

  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 5,
      comment: initialData?.comment || "",
    },
  });

  const rating = watch("rating");
  const { user } = useUser();

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user?.id) {
      toast.error("Please log in first!");
      return;
    }

    try {
      if (isEdit && initialData) {
        await updateReview({ id: initialData.id, ...values });
        toast.success("Review updated successfully!");
      } else {
        await createReview({
          ...values,
          productId,
          userId: user.id,
        });
        toast.success("Review added successfully!");
      }
      onSuccess();
      setOpen(false); // <-- Close dialog automatically
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerLabel === "Add Review" ? (
          <Button className="bg-blue-600 hover:bg-blue-700 duration-150 flex items-center gap-2 px-4 py-2">
            <Edit2 className="w-4 h-4" /> Add Review
          </Button>
        ) : triggerLabel === "Edit Review" ? (
          <button className="text-gray-500 cursor-pointer p-2 hover:bg-blue-100 rounded-xl hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        ) : (
          <Button>{triggerLabel}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Review" : "Add Review"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300 text-gray-300"
                  }`}
                  onClick={() => setValue("rating", star)}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              {...register("comment")}
              placeholder="Write your review..."
              className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                ? "Save"
                : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
