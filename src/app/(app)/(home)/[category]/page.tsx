import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";

import {
  ProductList,
  ProductListSkeleton,
} from "@/src/modules/products/ui/components/ProductList";
import Container from "@/src/modules/home/ui/components/Container";
import { ProductFilters } from "@/src/modules/products/ui/components/ProductFilters";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function page({ params }: Props) {
  const { category } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
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
