import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/src/trpc/routers/_app";

export type ProductsGetManyOutput =
  inferRouterOutputs<AppRouter>["products"]["getMany"];