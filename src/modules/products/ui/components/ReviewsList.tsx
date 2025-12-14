"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { toPersianNumber } from "@/src/lib/utils";
import { StarIcon } from "lucide-react";

interface ReviewsListProps {
  productId: string;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const trpc = useTRPC();

  const { data: reviews } = useSuspenseQuery(
    trpc.reviews.getByProduct.queryOptions({
      productId,
      status: "published",
    })
  );

  const getDisplayName = (review: any) => {
    if (review.کاربر?.username) {
      return `نظر کاربر ${review.کاربر.username}`;
    }

    if (review.کاربر?.email) {
      const emailPart = review.کاربر.email.split("@")[0];
      return `نظر کاربر ${emailPart}`;
    }

    if (review.title) {
      if (review.title.includes("نظر")) {
        return review.title;
      }
      return `نظر کاربر ${review.title}`;
    }

    return "نظر کاربر";
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
        <div className="text-gray-400 text-5xl mb-4">💬</div>
        <p className="text-gray-500">هنوز نظری برای این محصول ثبت نشده است.</p>
        <p className="text-sm text-gray-400 mt-2">
          اولین نفری باشید که نظر می‌دهد
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.امتیاز
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300 fill-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {toPersianNumber(review.امتیاز)} از ۵
                </span>
              </div>

              <h4 className="font-semibold text-gray-900">
                {getDisplayName(review)}
              </h4>
            </div>

            <span className="text-sm text-gray-400">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed text-right">
            {review.توضیحات}
          </p>
        </div>
      ))}
    </div>
  );
}
