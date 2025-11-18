import { createTRPCRouter } from "../init";

import { authRouter } from "@/src/modules/auth/server/procedures";
import { categoriesRouter } from "@/src/modules/categories/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
