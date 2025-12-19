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

interface Props {
  searchParams: Promise<SearchParams>;
}

const HOME_CATEGORIES = [
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

export default async function page({ searchParams }: Props) {
  const queryClient = getQueryClient();

  const prefetchPromises = HOME_CATEGORIES.map((category) => {
    if (category.slug) {
      return queryClient.prefetchQuery(
        trpc.products.getMany.queryOptions({
          category: category.slug,
          limit: 5,
          sort: "جدیدترین",
        })
      );
    }
    return queryClient.prefetchQuery(
      trpc.products.getMany.queryOptions({
        limit: 5,
        sort: "جدیدترین",
      })
    );
  });

  await Promise.all(prefetchPromises);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen">
        <Container>
          <div className="mt-2 mb-3 md:mt-3.5 md:mb-5.5">
            <Suspense fallback={<SearchFiltersLoading />}>
              <SearchFilters />
            </Suspense>
          </div>

          <div className="space-y-16">
            {HOME_CATEGORIES.map((category) => (
              <CategorySection
                key={category.slug || "all"}
                title={category.title}
                slug={category.slug}
                description={category.description}
                link={category.link}
                accentColor={category.accentColor}
              />
            ))}
          </div>
        </Container>
      </div>
    </HydrationBoundary>
  );
}
