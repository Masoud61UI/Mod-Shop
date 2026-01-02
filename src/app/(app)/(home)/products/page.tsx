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

export const dynamic = "force-dynamic";

export default async function page({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductsFilters(searchParams);
  
  const searchParamsObj = await searchParams;
  const page = parseInt(searchParamsObj.page as string || "1");

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      ...filters,
      category,
      page, 
      limit: 20, 
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductViewList category={category} showFilters={true} />
    </HydrationBoundary>
  );
}