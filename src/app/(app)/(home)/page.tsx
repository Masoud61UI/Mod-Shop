import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/src/trpc/server";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "@/src/modules/home/ui/components/search-filters";
import { Suspense } from "react";

import CategorySection from "@/src/modules/home/ui/components/CategorySection";
import Container from "@/src/modules/home/ui/components/Container";
import SearchResultsSummary from "@/src/modules/home/ui/components/SearchResultsSummary";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const HOME_CATEGORIES_COUNT = 4;

export const HOME_CATEGORIES = [
  {
    title: "جدیدترین محصولات",
    slug: null,
    description: "آخرین محصولات اضافه شده به فروشگاه",
    link: "/products?sort=جدیدترین",
    accentColor: "purple" as const,
  },
  {
    title: "لباس مردانه",
    slug: "menproducts",
    description: "برترین مدل‌های مردانه با کیفیت عالی",
    link: "/categories/menproducts",
    accentColor: "blue" as const,
  },
  {
    title: "لباس زنانه",
    slug: "womenproducts",
    description: "شیک‌ترین لباس‌های زنانه",
    link: "/categories/womenproducts",
    accentColor: "pink" as const,
  },
  {
    title: "اکسسوری",
    slug: "accessories",
    description: "جذاب‌ترین اکسسوری‌ها برای کامل کردن استایل",
    link: "/categories/accessories",
    accentColor: "amber" as const,
  },
];

async function checkSearchResults(searchValue: string, queryClient: any) {
  let hasResults = false;
  let totalResults = 0;
  
  try {
    const queryOptions: any = {
      limit: 5,
      sort: "جدیدترین",
      search: searchValue || undefined,
    };
    
    await queryClient.prefetchQuery(
      trpc.products.getMany.queryOptions(queryOptions)
    );
    
    const queryState = queryClient.getQueryState(
      trpc.products.getMany.queryOptions(queryOptions).queryKey
    );
    
    if (queryState?.data?.docs && queryState.data.docs.length > 0) {
      hasResults = true;
      totalResults = queryState.data.totalDocs || 0;
    }
  } catch (error) {
    console.error("Error checking search results:", error);
  }
  
  return { hasResults, totalResults };
}

export default async function page({ searchParams }: Props) {
  const searchParamsObj = await searchParams;
  const searchValue = searchParamsObj.search as string || "";
  
  const queryClient = getQueryClient();

  const prefetchPromises = HOME_CATEGORIES.map((category) => {
    const queryOptions: any = {
      limit: 5,
      sort: "جدیدترین",
    };

    if (searchValue) {
      queryOptions.search = searchValue;
    }

    if (category.slug) {
      queryOptions.category = category.slug;
    }

    return queryClient.prefetchQuery(
      trpc.products.getMany.queryOptions(queryOptions)
    );
  });

  await Promise.all(prefetchPromises);

  let searchResults = { hasResults: false, totalResults: 0 };
  if (searchValue) {
    searchResults = await checkSearchResults(searchValue, queryClient);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen">
        <Container>
          <div className="mt-2 mb-2.5 md:mt-3.5 md:mb-5.5">
            <Suspense fallback={<SearchFiltersLoading />}>
              <SearchFilters />
            </Suspense>
          </div>

          {searchValue && (
            <SearchResultsSummary 
              searchValue={searchValue}
              hasResults={searchResults.hasResults}
              totalResults={searchResults.totalResults}
              categoriesCount={HOME_CATEGORIES.length}
            />
          )}

          {(!searchValue || searchResults.hasResults) && (
            <div className="space-y-16">
              {HOME_CATEGORIES.map((category) => (
                <CategorySection
                  key={category.slug || "all"}
                  title={searchValue ? `نتایج در ${category.title}` : category.title}
                  slug={category.slug}
                  description={searchValue 
                    ? `محصولات مرتبط با "${searchValue}"` 
                    : category.description}
                  link={category.link + (searchValue ? `&search=${encodeURIComponent(searchValue)}` : '')}
                  accentColor={category.accentColor}
                  searchValue={searchValue}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    </HydrationBoundary>
  );
}