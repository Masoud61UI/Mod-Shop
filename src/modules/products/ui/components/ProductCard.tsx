import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string | null | undefined;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  reviewRating?: number;
  reviewCount?: number;
}

export default function ProductCard({
  id,
  name,
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
    <Link href={`/products/${id}`}>
      <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/no-image2.png"}
            className="object-cover"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              {discountPercent}% تخفیف
            </div>
          )}
        </div>
        <div className="p-4 border-t flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-2">{name}</h2>

          {(reviewCount > 0 || reviewRating > 0) && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
              <p className="text-sm font-medium">
                {reviewRating} {reviewCount > 0 && `(${reviewCount})`}
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat("fa-IR").format(price)} تومان
              </p>
            )}
            <p className="text-lg font-bold text-pink-600">
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
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};
