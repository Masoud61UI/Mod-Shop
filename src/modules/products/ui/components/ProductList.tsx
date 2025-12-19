"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { useSearchParams } from "next/navigation";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Button } from "@/src/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters";
import { InboxIcon } from "lucide-react";

interface Props {
  category?: string;
  gridLayout?: "default" | "home";
}

export const ProductList = ({ category, gridLayout = "default" }: Props) => {
  const [filters] = useProductFilters();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  const trpc = useTRPC();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          search: searchValue,
          category,
          limit: 8,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.nextPage ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  const gridClass =
    gridLayout === "home"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5";

  const hasSearch = searchValue.trim().length > 0;
  const noProductsFound = data.pages?.[0]?.docs.length === 0;

  if (noProductsFound) {
    return (
      <div className="border border-gray-600 border-dashed flex items-center justify-center p-8 flex-col gap-y-3 bg-white w-full rounded-lg">
        <InboxIcon className="text-purple-500" size={48} />
        <p className="text-base text-gray-800 font-medium">
          {hasSearch
            ? `محصولی با عنوان "${searchValue}" یافت نشد!`
            : "هیچ محصولی یافت نشد!"}
        </p>
        {hasSearch && (
          <Button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("search");
              window.location.href = `?${params.toString()}`;
            }}
            variant="outline"
            className="mt-4"
          >
            حذف فیلتر جستجو
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={gridClass}>
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              slug={product.slug}
              imageUrl={product.image?.url}
              price={product.price}
              discountPrice={product.discountPrice || undefined}
              discountPercent={product.discountPercent || undefined}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant="outline"
          >
            {isFetchingNextPage ? "در حال بارگذاری..." : "محصولات بیشتر"}
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = ({
  gridLayout = "default",
}: {
  gridLayout?: "default" | "home";
}) => {
  const gridClass =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5";

  return (
    <div className={gridClass}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
