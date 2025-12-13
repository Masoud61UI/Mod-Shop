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

  let productId: string;

  try {
    const product = await queryClient.fetchQuery(
      trpc.products.getOne.queryOptions({ slug })
    );

    productId = product.id;
  } catch (error) {
    notFound();
  }

  try {
    await queryClient.prefetchQuery(
      trpc.reviews.getOne.queryOptions({ productId })
    );
  } catch (error) {
    console.log("Could not prefetch review:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView slug={slug} />
    </HydrationBoundary>
  );
}
