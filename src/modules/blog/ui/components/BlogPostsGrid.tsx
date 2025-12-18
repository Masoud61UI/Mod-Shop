"use client";

import dynamic from "next/dynamic";
import BlogCard, { BlogCardSkeleton } from "../components/BlogCard";
import Pagination from "./Pagination";

const DynamicBlogCard = dynamic(() => import("../components/BlogCard"), {
  loading: () => <BlogCardSkeleton />,
  ssr: false,
});

interface BlogPostsGridProps {
  data: any;
  isLoading: boolean;
}

export default function BlogPostsGrid({ data, isLoading }: BlogPostsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.docs.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          مقاله‌ای یافت نشد
        </h3>
        <p className="text-gray-600">با تغییر فیلترها دوباره امتحان کنید</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.docs.map((post: any) => (
          <DynamicBlogCard
            key={post.id}
            {...post}
            featuredImage={post.featuredImage}
          />
        ))}
      </div>
      <Pagination data={data} />
    </>
  );
}
