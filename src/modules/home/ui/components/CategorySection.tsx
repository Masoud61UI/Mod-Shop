"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductCard, {
  ProductCardSkeleton,
} from "@/src/modules/products/ui/components/ProductCard";

interface CategorySectionProps {
  title: string;
  slug: string | null;
  description: string;
  link: string;
  accentColor?: "purple" | "amber" | "blue" | "pink";
}

export default function CategorySection({
  title,
  slug,
  description,
  link,
  accentColor = "purple",
}: CategorySectionProps) {
  const trpc = useTRPC();

  const { data: productsData, isLoading } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category: slug || undefined,
      limit: 5, 
      sort: "جدیدترین",
    })
  );

  const products = productsData?.docs || [];

  const colorClasses = {
    purple: {
      text: "text-purple-600",
      hover: "hover:text-purple-700",
      bg: "bg-purple-600",
    },
    amber: {
      text: "text-amber-600",
      hover: "hover:text-amber-700",
      bg: "bg-amber-600",
    },
    blue: {
      text: "text-blue-600",
      hover: "hover:text-blue-700",
      bg: "bg-blue-600",
    },
    pink: {
      text: "text-pink-600",
      hover: "hover:text-pink-700",
      bg: "bg-pink-600", 
    },
  };

  const { data: featuredProducts } = useSuspenseQuery(
  trpc.products.getMany.queryOptions({
    featured: true, 
    limit: 5,
    sort: "جدیدترین",
  })
);

  const colors = colorClasses[accentColor];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-7">
        <div className="space-y-[3px]">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-4 ${colors.bg} rounded-full`}></div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <p className="text-gray-500 text-sm pr-3.5">{description}</p>
        </div>

        <Link
          href={link}
          className={`inline-flex items-center border border-gray-200 gap-1 text-sm ${colors.text} ${colors.hover} font-medium group px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors`}
        >
          <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>همه</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="scale-90 sm:scale-100 origin-top">
                <ProductCardSkeleton />
              </div>
            ))
          : products.slice(0, 5).map((product: any) => (
              <div
                key={product.id}
                className="scale-90 sm:scale-100 origin-top transition-transform duration-200"
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
