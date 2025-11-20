"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";

import Container from "../Container";
import Categories from "./categories";
import SearchInput from "./SearchInput";
import BreadcrumbNavigation from "./BreadcrumbNavigation";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );

  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <Container>
      <div className="flex items-center gap-12 pt-4">
        <div className="hidden lg:block lg:w-[77%]">
          <Categories data={data} />
        </div>
        <div className="lg:w-[23%] w-full">
          <SearchInput />
        </div>
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </Container>
  );
};

export const SearchFiltersLoading = () => {
  return (
    <Container>
      <div
        className="flex items-center gap-12 pt-4"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="hidden lg:block lg:w-[77%]">
          <div className="h-10" />
        </div>
        <div className="lg:w-[23%] w-full">
          <SearchInput disabled />
        </div>
      </div>
    </Container>
  );
};
