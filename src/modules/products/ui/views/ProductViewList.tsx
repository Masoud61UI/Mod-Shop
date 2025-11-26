import { Suspense } from "react";

import ProductSort from "../components/ProductSort";
import { ProductFilters } from "../components/ProductFilters";
import Container from "@/src/modules/home/ui/components/Container";
import { ProductList, ProductListSkeleton } from "../components/ProductList";

interface Props {
  category?: string;
  showFilters?: boolean;
}

export default function ProductViewList({
  category,
  showFilters = true,
}: Props) {
  return (
    <Container>
      {showFilters && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between my-6">
          <p className="text-lg font-medium text-gray-700">محصولات منتخب</p>
          <div className="hidden lg:block flex-1 h-px bg-gray-200 mx-4"></div>
          <ProductSort />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        {showFilters && (
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
        )}

        <div
          className={
            showFilters ? "lg:col-span-4 xl:col-span-6" : "lg:col-span-full"
          }
        >
          <Suspense
            fallback={
              <ProductListSkeleton
                gridLayout={showFilters ? "default" : "home"}
              />
            }
          >
            <ProductList
              category={category}
              gridLayout={showFilters ? "default" : "home"}
            />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
