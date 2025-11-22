"use client";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

import { useProductFilters } from "../../hooks/use-product-filters";

export default function ProductSort() {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className={cn(
          "rounded-full px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-600",
          filters.sort === "جدیدترین"
            ? "border-purple-400 text-purple-400"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => setFilters({ ...filters, sort: "جدیدترین" })}
      >
        جدیدترین
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-600",
          filters.sort === "پرفروش‌ترین"
            ? "border-purple-400 text-purple-400"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => setFilters({ ...filters, sort: "پرفروش‌ترین" })}
      >
        پرفروش‌ترین
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-full px-2 py-0.5 bg-gray-50 border border-gray-200 hover:bg-purple-100 cursor-pointer text-gray-600",
          filters.sort === "قدیمی‌ترین"
            ? "border-purple-400 text-purple-400"
            : "hover:bg-purple-100"
        )}
        variant="secondary"
        onClick={() => setFilters({ ...filters, sort: "قدیمی‌ترین" })}
      >
        قدیمی‌ترین
      </Button>
    </div>
  );
}
