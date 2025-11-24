import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";

import { loadProductsFilters } from "@/src/modules/products/searchParams";
import ProductViewList from "@/src/modules/products/ui/views/ProductViewList";

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
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category,
      limit: 8,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductViewList category={category} />
    </HydrationBoundary>
  );
}
