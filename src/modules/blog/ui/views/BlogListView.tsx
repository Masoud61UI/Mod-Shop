"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import BlogHero from "../components/BlogHero";
import BlogSidebar from "../components/BlogSidebar";
import BlogContent from "../components/BlogContent";
import Container from "@/src/modules/home/ui/components/Container";

export default function BlogListView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tag, setTag] = useState(searchParams.get("tag") || "");

  const trpc = useTRPC();

  const { data: blogData, isLoading: isBlogLoading } = useSuspenseQuery(
    trpc.blog.getMany.queryOptions({
      page: 1,
      limit: 9,
      tag: tag || undefined,
    })
  );

  const { data: featuredProducts } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      limit: 3,
      sort: "جدیدترین",
    })
  );

  const handleTagChange = useCallback(
    (value: string) => {
      const newTag = value === "all" ? "" : value;
      setTag(newTag);
      const params = new URLSearchParams();
      if (newTag) params.set("tag", newTag);
      router.push(`/blog?${params.toString()}`);
    },
    [router]
  );

  const clearFilters = useCallback(() => {
    setTag("");
    router.push("/blog");
  }, [router]);

  const hasActiveFilters = !!tag;

  return (
    <div className="min-h-screen bg-white">
      <BlogHero />

      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <BlogContent
              blogData={blogData}
              isLoading={isBlogLoading}
              activeTag={tag}
              hasActiveFilters={hasActiveFilters}
              onTagChange={handleTagChange}
              onClearFilters={clearFilters}
            />

            <BlogSidebar products={featuredProducts?.docs || []} />
          </div>
        </div>
      </Container>
    </div>
  );
}
