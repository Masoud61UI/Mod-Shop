import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/src/trpc/server";
import BlogDetailView from "@/src/modules/blog/ui/views/BlogDetailView";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    const post = (await queryClient.fetchQuery(
      trpc.blog.getOne.queryOptions(slug)
    )) as any;

    if (post?.id) {
      await queryClient.prefetchQuery(
        trpc.blog.getRelated.queryOptions({
          excludeId: post.id,
          limit: 3,
        })
      );
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogDetailView slug={slug} />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}
