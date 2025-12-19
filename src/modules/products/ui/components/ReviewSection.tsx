import ReviewForms from "../components/ReviewForms";
import ReviewsList from "../components/ReviewsList";
import ReviewStats from "./ReviewStats";
import { Button } from "@/src/components/ui/button";
import { toPersianNumber } from "@/src/lib/utils";

interface ReviewSectionProps {
  productId: string;
  reviewRating?: number;
  reviewCount?: number;
  ratingDistribution?: Record<number, number>;
}

export default function ReviewSection({
  productId,
  reviewRating,
  reviewCount,
  ratingDistribution,
}: ReviewSectionProps) {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">نظرات کاربران</h3>

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8">
        <ReviewStats
          reviewRating={reviewRating}
          reviewCount={reviewCount}
          ratingDistribution={ratingDistribution}
          productId={productId}
        />
      </div>

      <div
        id="review-form"
        className="bg-white border border-gray-200 rounded-xl p-6 mb-11"
      >
        <ReviewForms productId={productId} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center">
          <h4 className="text-lg font-semibold text-gray-900">
            دیدگاه کاربران
          </h4>
          {(reviewCount || 0) > 0 && (
            <span className="mr-2 text-sm text-gray-500">
              ({toPersianNumber(reviewCount || 0)} نظر)
            </span>
          )}
        </div>

        <ReviewsList productId={productId} />

        {(reviewCount || 0) > 5 && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              مشاهده همه نظرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
