"use client";

import { Button } from "@/src/components/ui/button";
import { X, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchResultsSummaryProps {
  searchValue: string;
  hasResults: boolean;
  totalResults: number;
  categoriesCount?: number; 
}

export default function SearchResultsSummary({ 
  searchValue, 
  hasResults, 
}: SearchResultsSummaryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  if (!searchValue) return null;

  return (
    <div className="mb-8">
      {hasResults ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-purple-50">
                <Search className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  جستجو: <span className="text-purple-700 font-semibold">"{searchValue}"</span>
                </h3>
              </div>
            </div>
            
            <Button
              onClick={handleClearSearch}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 cursor-pointer"
            >
              <X className="h-1 w-1" />
              <span className="text-xs">پاک کردن</span>
            </Button>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            نتیجه‌ای برای "{searchValue}" یافت نشد
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            پیشنهاد می‌کنیم عبارت جستجو را تغییر دهید یا از فیلترهای دیگر استفاده کنید
          </p>
          <Button
            onClick={handleClearSearch}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4 ml-1" />
            پاک کردن جستجو
          </Button>
        </div>
      )}
    </div>
  );
}