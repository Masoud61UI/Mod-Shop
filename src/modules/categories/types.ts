import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/src/trpc/routers/_app";

export type CategoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
