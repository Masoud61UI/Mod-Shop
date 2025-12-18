import { createTRPCRouter } from "../init";

import { authRouter } from "@/src/modules/auth/server/procedures";
import { productsRouter } from "@/src/modules/products/server/procedures";
import { checkoutRouter } from "@/src/modules/checkout/server/procedures";
import { categoriesRouter } from "@/src/modules/categories/server/procedures";
import { shippingRouter } from "@/src/modules/shipping/shippingRouter";
import { reviewsRouter } from "@/src/modules/reviews/server/procedures";
import { contactRouter } from "@/src/modules/contact/server/procedures";
import { blogRouter } from "@/src/modules/blog/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  blog: blogRouter,
  reviews: reviewsRouter,
  contact: contactRouter,
  products: productsRouter,
  checkout: checkoutRouter,
  shipping: shippingRouter,
  categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
