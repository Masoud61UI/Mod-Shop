"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Button } from "@/src/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters";
import { InboxIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toPersianNumber } from "@/src/lib/utils";

interface Props {
  category?: string;
  gridLayout?: "default" | "home";
}

export const ProductList = ({ category, gridLayout = "default" }: Props) => {
  const [filters, setFilters] = useProductFilters();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchValue = searchParams.get("search") || "";

  // دریافت صفحه از URL
  const currentPage = parseInt(searchParams.get("page") || "1");
  const prevSortRef = useRef(filters.sort);
  const prevFiltersRef = useRef(filters);

  const trpc = useTRPC();

  const { data, refetch } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      ...filters,
      search: searchValue,
      category,
      page: currentPage,
      limit: 20,
    })
  );

  // اصلاح شده: gap برای موبایل 1 و برای دسکتاپ 4 یا 5
  const gridClass =
    gridLayout === "home"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-5"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-5"; 

  const hasSearch = searchValue.trim().length > 0;
  const noProductsFound = data?.docs.length === 0;

  // تابع تغییر صفحه
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  // تابع ساده‌تر برای نمایش صفحات
  const getPageNumbers = (): (number | string)[] => {
    const totalPages = data?.totalPages || 1;
    const current = currentPage;

    // اگر صفحات کم هستند، همه را نشان بده
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result: (number | string)[] = [];

    // همیشه صفحه 1
    result.push(1);

    // صفحات نزدیک به صفحه فعلی
    if (current > 3) {
      result.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (current < totalPages - 2) {
      result.push("...");
    }

    // همیشه صفحه آخر
    if (totalPages > 1) {
      result.push(totalPages);
    }

    return result;
  };

  // تابع تغییر سورت
  const handleSortChange = (
    newSort: "جدیدترین" | "پرفروش‌ترین" | "قدیمی‌ترین"
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);

    // تصمیم‌گیری برای صفحه مقصد
    let targetPage = 1;

    if (newSort === "قدیمی‌ترین") {
      // برای قدیمی‌ترین باید به صفحه آخر برویم
      // اما چون هنوز totalPages رو نداریم، باید query جدید بزنیم
      // یک راه حل: بگذارید کاربر بعد از تغییر سورت، خودش به صفحه آخر برود
      // راه بهتر: یک useEffect جداگانه
      targetPage = 1; // موقتاً، بعداً در useEffect اصلاح می‌شود
    } else if (newSort === "جدیدترین" || newSort === "پرفروش‌ترین") {
      targetPage = 1;
    }

    params.set("page", targetPage.toString());
    router.push(`?${params.toString()}`);

    // آپدیت فیلترها
    setFilters({ ...filters, sort: newSort, page: targetPage });
  };

  // useEffect برای مدیریت تغییر سورت به "قدیمی‌ترین"
  useEffect(() => {
    const currentSort = filters.sort;
    const prevSort = prevSortRef.current;

    // اگر سورت به "قدیمی‌ترین" تغییر کرد
    if (currentSort === "قدیمی‌ترین" && prevSort !== "قدیمی‌ترین") {
      // و الان در صفحه اول هستیم
      if (currentPage === 1 && data?.totalPages && data.totalPages > 1) {
        // به صفحه آخر برو
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", data.totalPages.toString());
        router.replace(`?${params.toString()}`);

        // آپدیت فیلترها
        setFilters({ ...filters, page: data.totalPages });

        console.log(
          `🔄 تغییر سورت به قدیمی‌ترین: رفتن به صفحه آخر (${data.totalPages})`
        );
      }
    }

    // ذخیره سورت فعلی برای دفعه بعد
    prevSortRef.current = currentSort;
    prevFiltersRef.current = filters;
  }, [
    filters.sort,
    currentPage,
    data?.totalPages,
    router,
    searchParams,
    filters,
    setFilters,
  ]);

  // هنگام تغییر هر فیلتر (غیر از سورت) به صفحه اول برو
  useEffect(() => {
    const currentFilters = filters;
    const prevFilters = prevFiltersRef.current;

    // بررسی تغییرات فیلترها
    const filtersChanged =
      currentFilters.minPrice !== prevFilters.minPrice ||
      currentFilters.maxPrice !== prevFilters.maxPrice ||
      currentFilters.sort !== prevFilters.sort;

    // اگر فیلترها تغییر کردند و صفحه اول نیستیم
    if (filtersChanged && currentPage !== 1) {
      // اما اگر فقط سورت به "قدیمی‌ترین" تغییر کرده، این کار رو نکن
      if (
        !(
          prevFilters.sort !== "قدیمی‌ترین" &&
          currentFilters.sort === "قدیمی‌ترین"
        )
      ) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.replace(`?${params.toString()}`);

        // آپدیت فیلترها
        setFilters({ ...filters, page: 1 });
      }
    }
  }, [filters, currentPage, router, searchParams, setFilters]);

  if (noProductsFound) {
    return (
      <div className="border border-gray-600 border-dashed flex items-center justify-center p-8 flex-col gap-y-3 bg-white w-full rounded-lg">
        <InboxIcon className="text-purple-500" size={48} />
        <p className="text-base text-gray-800 font-medium">
          {hasSearch
            ? `محصولی با عنوان "${searchValue}" یافت نشد!`
            : "هیچ محصولی یافت نشد!"}
        </p>
        {hasSearch && (
          <Button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("search");
              params.delete("page");
              window.location.href = `?${params.toString()}`;
            }}
            variant="outline"
            className="mt-4"
          >
            حذف فیلتر جستجو
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Header با اطلاعات صفحه‌بندی */}
      <div className="flex items-center gap-6 text-sm text-gray-700 mt-2 mb-8">
        {/* تعداد محصولات */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">محصول</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded text-xs font-bold">
              {toPersianNumber(data?.docs.length || 0)}
            </div>
            <span className="text-gray-500">از</span>
            <span className="font-medium">{toPersianNumber(data?.totalDocs || 0)}</span>
          </div>
        </div>
        
        {/* جداکننده */}
        <div className="w-px h-4 bg-gray-300"></div>
        
        {/* شماره صفحه */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">صفحه</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-800 rounded text-xs font-bold">
              {toPersianNumber(currentPage)}
            </div>
            <span className="text-gray-500">از</span>
            <span className="font-medium">{toPersianNumber(data?.totalPages || 1)}</span>
          </div>
        </div>
      </div>

      {/* GRID با scale برای موبایل */}
      <div className={gridClass}>
        {data?.docs.map((product) => (
          <div
            key={product.id}
            className="
              scale-90 
              sm:scale-100 
              origin-top 
              transition-transform 
              duration-200
              hover:scale-95
              sm:hover:scale-105
            "
          >
            <ProductCard
              name={product.name}
              slug={product.slug}
              imageUrl={product.image?.url}
              price={product.price}
              discountPrice={product.discountPrice || undefined}
              discountPercent={product.discountPercent || undefined}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
            />
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {/* دکمه قبلی */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Button>

          {/* شماره صفحات */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${page}-${index}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page as number)}
                  className={`min-w-10 ${
                    currentPage === page
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "hover:bg-purple-50"
                  }`}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* دکمه بعدی */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === data.totalPages}
            className="flex items-center gap-1"
          >
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export const ProductListSkeleton = ({
  gridLayout = "default",
}: {
  gridLayout?: "default" | "home";
}) => {
  const gridClass =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-5"; // اینجا هم اصلاح شد

  return (
    <div className={gridClass}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="scale-90 sm:scale-100 origin-top">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
};