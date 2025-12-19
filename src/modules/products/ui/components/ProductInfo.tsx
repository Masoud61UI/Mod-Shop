import { formatToman, toPersianNumber } from "@/src/lib/utils";

interface ProductInfoProps {
  name: string;
  reviewRating?: number;
  reviewCount?: number;
  isInStock: boolean;
  selectedColor: string;
  selectedSize: string;
  selectedDisplayStock: number;
  hasDiscount: boolean;
  discountPrice?: number;
  price: number;
}

export default function ProductInfo({
  name,
  reviewRating,
  reviewCount,
  isInStock,
  selectedColor,
  selectedSize,
  selectedDisplayStock,
  hasDiscount,
  discountPrice,
  price,
}: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
        {name}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-500">
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {reviewRating ? toPersianNumber(reviewRating.toFixed(1)) : "۰"}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            ({toPersianNumber(reviewCount || 0)} نظر)
          </span>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <span
          className={`text-sm font-medium ${
            isInStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {isInStock
            ? `✓ موجود در انبار (${toPersianNumber(selectedDisplayStock)} عدد)`
            : selectedColor && selectedSize
              ? "✗ ناموجود"
              : "لطفا رنگ و سایز را انتخاب کنید"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-3">
          <p className="text-[26px] font-bold text-purple-600">
            {formatToman(hasDiscount ? discountPrice! : price)}
            <span className="text-sm font-normal mr-1">تومان</span>
          </p>
          {hasDiscount && (
            <p className="text-lg text-gray-400 line-through">
              {formatToman(price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
