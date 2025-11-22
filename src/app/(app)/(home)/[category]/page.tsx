import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";

import {
  ProductList,
  ProductListSkeleton,
} from "@/src/modules/products/ui/components/ProductList";
import Container from "@/src/modules/home/ui/components/Container";
import { loadProductsFilters } from "@/src/modules/products/searchParams";
import ProductSort from "@/src/modules/products/ui/components/ProductSort";
import { ProductFilters } from "@/src/modules/products/ui/components/ProductFilters";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function page({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductsFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between mt-6">
          <p className="text-lg font-medium text-gray-700">محصولات منتخب</p>
          <div className="hidden lg:block flex-1 h-px bg-gray-200 mx-4"></div>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
