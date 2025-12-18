"use client";

import { Button } from "@/src/components/ui/button";

interface BlogTagsProps {
  activeTag: string;
  onTagChange: (value: string) => void;
}

export default function BlogTags({ activeTag, onTagChange }: BlogTagsProps) {
  const tags = [
    { label: "همه مقالات", value: "all" },
    { label: "ترندهای فصلی", value: "seasonal-trends" },
    { label: "استایل‌سازی", value: "styling" },
    { label: "مراقبت از لباس", value: "clothing-care" },
    { label: "تخفیف‌ها", value: "discounts" },
    { label: "اخبار", value: "news" },
  ];

  const isTagActive = (tagValue: string) => {
    if (tagValue === "all") {
      return activeTag === "" || activeTag === "all";
    }
    return activeTag === tagValue;
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-4">دسته‌بندی‌ها</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tagItem) => {
          const isActive = isTagActive(tagItem.value);

          return (
            <Button
              key={tagItem.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onTagChange(tagItem.value)}
              className={`rounded-full cursor-pointer transition-colors ${
                isActive
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              {tagItem.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
