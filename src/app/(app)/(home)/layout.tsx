import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";

import Footer from "@/src/modules/home/ui/components/Footer";
import Navbar from "@/src/modules/home/ui/components/Navbar";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "@/src/modules/home/ui/components/search-filters";

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
