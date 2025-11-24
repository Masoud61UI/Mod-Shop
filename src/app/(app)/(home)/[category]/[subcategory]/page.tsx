import type { SearchParams } from "nuqs/server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";
import { loadProductsFilters } from "@/src/modules/products/searchParams";
import ProductViewList from "@/src/modules/products/ui/views/ProductViewList";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function page({ params, searchParams }: Props) {
  const { subcategory } = await params;
  const filters = await loadProductsFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductViewList category={subcategory} />
    </HydrationBoundary>
  );
}
