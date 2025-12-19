import { Button } from "@/src/components/ui/button";
import { toPersianNumber } from "@/src/lib/utils";

interface ReviewStatsProps {
  reviewRating?: number;
  reviewCount?: number;
  ratingDistribution?: Record<number, number>;
  productId: string;
}

export default function ReviewStats({
  reviewRating,
  reviewCount,
  ratingDistribution,
  productId,
}: ReviewStatsProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
        <div className="text-center sm:text-right w-full sm:w-auto">
          <div className="text-3xl md:text-4xl font-bold text-gray-900">
            {reviewRating ? toPersianNumber(reviewRating.toFixed(1)) : "۰"}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  star <= Math.floor(reviewRating || 0)
                    ? "text-amber-500 fill-current"
                    : "text-amber-200 fill-amber-200"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            از {toPersianNumber(reviewCount || 0)} نظر
          </p>
        </div>

        <div className="h-px w-full sm:w-px sm:h-16 bg-gray-200 my-4 sm:my-0"></div>

        <div className="space-y-2 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage = ratingDistribution?.[star] || 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <div className="text-xs sm:text-sm font-medium text-gray-600 w-16 sm:w-auto">
                  {star} ستاره
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 w-8 sm:w-10 text-left">
                  {toPersianNumber(
                    Math.round((percentage * (reviewCount || 0)) / 100)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() =>
          document
            .getElementById("review-form")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-[15px] bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer w-full sm:w-auto mt-4 sm:mt-0"
      >
        نوشتن نظر
      </button>
    </div>
  );
}
