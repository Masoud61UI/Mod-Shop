"use client";

import { Button } from "@/src/components/ui/button";

interface PaginationProps {
  data: any;
}

export default function Pagination({ data }: PaginationProps) {
  if (data.totalPages <= 1) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={data.page === 1}
          className="border-gray-300"
        >
          قبلی
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={data.page === pageNum ? "default" : "outline"}
                size="sm"
                className={`min-w-10 ${
                  data.page === pageNum ? "bg-purple-600" : "border-gray-300"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={data.page === data.totalPages}
          className="border-gray-300"
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
