"use client";

import { X } from "lucide-react";
import { TAG_OPTIONS } from "@/src/modules/blog/utils/tags";

interface FilterBarProps {
  activeTag: string;
  onTagChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  activeTag,
  onTagChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const tagOptions = TAG_OPTIONS;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              دسته‌بندی‌ها:
            </span>

            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const isActive =
                  tag.value === "all"
                    ? activeTag === "" || activeTag === "all"
                    : activeTag === tag.value;

                return (
                  <button
                    key={tag.value}
                    onClick={() => onTagChange(tag.value)}
                    className={`rounded-full text-xs px-[14px] py-2 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border border-purple-300 font-semibold"
                        : "bg-white font-normal text-gray-700 border border-gray-300 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    {isActive && (
                      <span className="ml-1 text-purple-600">●</span>
                    )}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {hasActiveFilters && activeTag !== "" && activeTag !== "all" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-600">دسته‌بندی فعال:</span>
                  <span className="font-medium text-sm text-purple-700">
                    {tagOptions.find((t) => t.value === activeTag)?.label ||
                      activeTag}
                  </span>
                </div>

                <button
                  onClick={onClearFilters}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-3 py-2 h-auto hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  پاک کردن فیلتر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
