"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";

import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Button } from "@/src/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters";
import { InboxIcon } from "lucide-react";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
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

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-gray-600 border-dashed flex items-center justify-center p-8 flex-col gap-y-3 bg-white w-full rounded-lg">
        <InboxIcon className="text-purple-500" />
        <p className="text-base text-gray-800 font-medium">
          هیچ محصولی یافت نشد!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              imageUrl={product.image?.url}
              price={product.price}
              discountPrice={product.discountPrice || undefined}
              discountPercent={product.discountPercent || undefined}
              reviewRating={4.5}
              reviewCount={24}
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

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
