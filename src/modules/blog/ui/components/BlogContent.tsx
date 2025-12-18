"use client";

import FilterBar from "./FilterBar";
import BlogPostsGrid from "./BlogPostsGrid";

interface BlogContentProps {
  blogData: any;
  isLoading: boolean;
  activeTag: string;
  hasActiveFilters: boolean;
  onTagChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function BlogContent({
  blogData,
  isLoading,
  activeTag,
  hasActiveFilters,
  onTagChange,
  onClearFilters,
}: BlogContentProps) {
  return (
    <div className="lg:col-span-3">
      <FilterBar
        activeTag={activeTag}
        onTagChange={onTagChange}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <BlogPostsGrid data={blogData} isLoading={isLoading} />
    </div>
  );
}
