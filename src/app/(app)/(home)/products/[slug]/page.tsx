// src/app/(app)/(home)/products/[slug]/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/src/trpc/server";
import ProductView from "@/src/modules/products/ui/views/ProductView";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: Props) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.products.getOne.queryOptions({ slug })
    );
  } catch (error) {
    console.error("❌ خطا در دریافت محصول:", error);
    notFound(); // صفحه 404 نشون بده
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView slug={slug} />
    </HydrationBoundary>
  );
}