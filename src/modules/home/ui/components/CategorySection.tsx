"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductCard, {
  ProductCardSkeleton,
} from "@/src/modules/products/ui/components/ProductCard";
import { useSearchParams } from "next/navigation";

interface CategorySectionProps {
  title: string;
  slug: string | null;
  description: string;
  link: string;
  accentColor?: "purple" | "amber" | "blue" | "pink";
  searchValue?: string;
}

export default function CategorySection({
  title,
  slug,
  description,
  link,
  accentColor = "purple",
  searchValue = "",
}: CategorySectionProps) {
  const trpc = useTRPC();
  const allSearchParams = useSearchParams();
  const currentSearchValue = allSearchParams.get("search") || searchValue;

  const { data: productsData, isLoading } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category: slug || undefined,
      limit: 5,
      sort: "جدیدترین",
      search: currentSearchValue || undefined,
    })
  );

  const products = productsData?.docs || [];

  const colorClasses = {
    purple: {
      text: "text-purple-600",
      hover: "hover:text-purple-700",
      bg: "bg-purple-600",
      lightBg: "bg-purple-50",
      badgeBg: "bg-purple-100", // اضافه شده
    },
    amber: {
      text: "text-amber-600",
      hover: "hover:text-amber-700",
      bg: "bg-amber-600",
      lightBg: "bg-amber-50",
      badgeBg: "bg-amber-100", // اضافه شده
    },
    blue: {
      text: "text-blue-600",
      hover: "hover:text-blue-700",
      bg: "bg-blue-600",
      lightBg: "bg-blue-50",
      badgeBg: "bg-blue-100", // اضافه شده
    },
    pink: {
      text: "text-pink-600",
      hover: "hover:text-pink-700",
      bg: "bg-pink-600",
      lightBg: "bg-pink-50",
      badgeBg: "bg-pink-100", // اضافه شده
    },
  };

  const colors = colorClasses[accentColor];

  // **تغییر اصلی ۱: اگر جستجو شده، فقط دسته‌بندی‌ای که محصول دارد را نشان بده**
  if (currentSearchValue) {
    // اگر جستجو شده و محصولی در این دسته‌بندی نیست، کامپوننت را نشان نده
    if (products.length === 0) {
      return null;
    }
    // اگر جستجو شده و محصول داریم، اما دسته‌بندی "جدیدترین محصولات" (slug: null) است، نشان نده
    // این یعنی فقط دسته‌بندی‌های خاص (مردانه، زنانه، اکسسوری) نشان داده شوند
    if (!slug) {
      return null;
    }
  }

  // اگر در حالت عادی (بدون جستجو) محصولی نیست، نشان نده
  if (!isLoading && products.length === 0 && !currentSearchValue) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-7">
        <div className="space-y-[3px]">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-4 ${colors.bg} rounded-full`}></div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {currentSearchValue && products.length > 0 ? (
                <span className="flex items-center gap-2">
                  <span>{title}</span>
                  <span
                    className={`text-xs ${colors.text} ${colors.badgeBg} px-2 py-0.5 rounded-full`}
                  >
                    {products.length} محصول
                  </span>
                </span>
              ) : (
                title
              )}
            </h2>
          </div>
          <p className="text-gray-500 text-sm pr-3.5">{description}</p>
        </div>

        {products.length > 0 && (
          <Link
            href={
              link +
              (currentSearchValue
                ? `&search=${encodeURIComponent(currentSearchValue)}`
                : "")
            }
            className={`inline-flex items-center gap-1 text-xs ${colors.text} ${colors.hover} font-medium group px-3 py-2 rounded-md ${colors.lightBg} hover:bg-opacity-80 transition-colors`}
          >
            همه
            <ChevronLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="scale-90 sm:scale-100 origin-top">
                <ProductCardSkeleton />
              </div>
            ))
          : products.slice(0, 5).map((product: any) => (
              <div
                key={product.id}
                className="scale-90 sm:scale-100 origin-top transition-transform duration-200 hover:scale-91 sm:hover:scale-101"
              >
                <ProductCard
                  name={product.name}
                  slug={product.slug}
                  imageUrl={product.image?.url}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  discountPercent={product.discountPercent}
                  reviewRating={product.reviewRating}
                  reviewCount={product.reviewCount}
                />
              </div>
            ))}
      </div>

      <div className="mt-4 pt-6 md:mt-14 border-t border-gray-200"></div>
    </section>
  );
}