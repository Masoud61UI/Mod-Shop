"use client";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSort() {
  const [filters, setFilters] = useProductFilters();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = async (sortValue: "پرفروش‌ترین" | "جدیدترین" | "قدیمی‌ترین") => {
    console.log("🎯 Setting sort to:", sortValue);

    // گرفتن داده‌های فعلی از cache
    const cachedData: any = queryClient.getQueryData(["products"]);
    let totalPages = cachedData?.totalPages || 1;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    
    // تعیین صفحه مقصد
    let targetPage = 1;
    
    if (sortValue === "قدیمی‌ترین") {
      targetPage = totalPages; // صفحه آخر برای قدیمی‌ترین
    } else {
      targetPage = 1; // صفحه اول برای بقیه
    }
    
    params.set("page", targetPage.toString());
    router.push(`?${params.toString()}`);

    // آپدیت فیلترها
    setFilters({ ...filters, sort: sortValue, page: targetPage });

    // فورس ریفرش query
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      console.log(`🔄 Query invalidated - رفتن به صفحه ${targetPage}`);
    }, 100);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className={cn(
          "rounded-full text-sm px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-500",
          filters.sort === "جدیدترین"
            ? "border-purple-400 text-purple-500"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => handleSort("جدیدترین")}
      >
        جدیدترین
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full text-sm px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-500",
          filters.sort === "پرفروش‌ترین"
            ? "border-purple-400 text-purple-500"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => handleSort("پرفروش‌ترین")}
      >
        پرفروش‌ترین
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full text-sm px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-500",
          filters.sort === "قدیمی‌ترین"
            ? "border-purple-400 text-purple-500"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => handleSort("قدیمی‌ترین")}
      >
        قدیمی‌ترین
      </Button>
    </div>
  );
}