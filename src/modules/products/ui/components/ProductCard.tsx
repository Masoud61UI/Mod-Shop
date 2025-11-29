import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { toPersianNumber } from "@/src/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  imageUrl: string | null | undefined;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  reviewRating?: number;
  reviewCount?: number;
}

export default function ProductCard({
  name,
  slug,
  imageUrl,
  price,
  discountPrice,
  discountPercent,
  reviewRating = 4.5,
  reviewCount = 0,
}: ProductCardProps) {
  const finalPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <Link href={`/products/${slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 h-full flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            alt={name}
            fill
            src={imageUrl || "/no-image2.png"}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              ٪{toPersianNumber(discountPercent || 0)} تخفیف
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-purple-500 px-4 py-2 rounded-full font-medium text-sm shadow-lg border cursor-pointer">
              مشاهده محصول
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-relaxed group-hover:text-gray-600 transition-colors">
            {name}
          </h2>

          {(reviewCount > 0 || reviewRating > 0) && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(reviewRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {toPersianNumber(reviewRating)}{" "}
                {reviewCount > 0 &&
                  `(${toPersianNumber(reviewCount)} نظر)`}{" "}
              </p>
            </div>
          )}

          <div className="flex items-center gap-[10px] mt-auto">
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                {new Intl.NumberFormat("fa-IR").format(price)} تومان
              </p>
            )}
            <p className="text-lg font-bold text-purple-600">
              {new Intl.NumberFormat("fa-IR").format(finalPrice)} تومان
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-gray-200"></div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center gap-2 mt-auto">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};
