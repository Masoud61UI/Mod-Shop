"use client";

import Link from "next/link";

interface FeaturedProductItemProps {
  product: any;
}

export default function FeaturedProductItem({
  product,
}: FeaturedProductItemProps) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Link href={`/products/${product.slug}`}>
            <img
            src={product.image?.url || "/no-image2.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          {hasDiscount && discountPercentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[10px] font-bold text-center py-0.5">
              {discountPercentage}%
            </div>
          )}
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h4 className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600 transition-colors">
              {product.name}
            </h4>
          </Link>

          <div className="mt-1">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-sm font-bold text-purple-600">
                    {new Intl.NumberFormat("fa-IR").format(
                      product.discountPrice
                    )}{" "}
                    تومان
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {new Intl.NumberFormat("fa-IR").format(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-purple-600">
                  {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
                </span>
              )}
            </div>

            {hasDiscount && discountPercentage > 0 && (
              <div className="mt-0.5">
                <span className="text-[10px] text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                  تخفیف
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
