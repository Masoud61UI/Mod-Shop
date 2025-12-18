"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { BlogPost } from "@/src/modules/blog/types/blog.types";
import BlogDetailHero from "../components/BlogDetailHero";
import BlogDetailActions from "../components/BlogDetailActions";
import BlogDetailContent from "../components/BlogDetailContent";
import BlogDetailRelated from "../components/BlogDetailRelated";
import BlogDetailNotFound from "../components/BlogDetailNotFound";
import Container from "@/src/modules/home/ui/components/Container";

export default function BlogDetailView({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const { data: post } = useSuspenseQuery(
    trpc.blog.getOne.queryOptions(slug)
  ) as { data: BlogPost };

  const { data: relatedPosts } = useSuspenseQuery(
    trpc.blog.getRelated.queryOptions({
      excludeId: post.id,
      limit: 3,
    })
  );

  if (!post) {
    return <BlogDetailNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          <BlogDetailHero post={post} />

          <BlogDetailContent post={post} />

          <BlogDetailActions {...{ title: post.title }} />

          <BlogDetailRelated posts={relatedPosts.docs} showAllLink="/blog" />
        </div>
      </Container>
    </div>
  );
}
