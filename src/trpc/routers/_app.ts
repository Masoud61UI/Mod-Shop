import { createTRPCRouter } from "../init";

import { authRouter } from "@/src/modules/auth/server/procedures";
import { productsRouter } from "@/src/modules/products/server/procedures";
import { checkoutRouter } from "@/src/modules/checkout/server/procedures";
import { categoriesRouter } from "@/src/modules/categories/server/procedures";
import { shippingRouter } from "@/src/modules/shipping/shippingRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  checkout: checkoutRouter,
  shipping: shippingRouter,
  categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
