import { createTRPCRouter } from "../init";

import { authRouter } from "@/src/modules/auth/server/procedures";
import { productsRouter } from "@/src/modules/products/server/procedures";
import { categoriesRouter } from "@/src/modules/categories/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
