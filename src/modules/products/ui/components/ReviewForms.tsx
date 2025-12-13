"use client";

import { useTRPC } from "@/src/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewForm from "./ReviewForm";

interface Props {
  productId: string;
}

export default function ReviewForms({ productId }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId: productId,
    })
  );

  return <ReviewForm productId={productId} initialData={data} />;
}
