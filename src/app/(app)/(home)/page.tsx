import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";

import { loadProductsFilters } from "@/src/modules/products/searchParams";
import ProductViewList from "@/src/modules/products/ui/views/ProductViewList";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "@/src/modules/home/ui/components/search-filters";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function page({ searchParams }: Props) {
  const filters = await loadProductsFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: 8,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SearchFiltersLoading />}>
        <SearchFilters />
      </Suspense>
      <ProductViewList showFilters={false} />
    </HydrationBoundary>
  );
}
