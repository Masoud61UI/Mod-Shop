import { baseProcedure, createTRPCRouter } from "@/src/trpc/init";

export const shippingRouter = createTRPCRouter({
  getSettings: baseProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.find({
        collection: "shipping-settings",
        limit: 1,
      });

      if (data.docs.length > 0) {
        return data.docs[0];
      }

      return {
        enabled: true,
        baseCost: 70000,
        freeThreshold: 1000000,
        message: "خرید بالای ۱,۰۰۰,۰۰۰ تومان رایگان",
      };
    } catch (error) {
      return {
        enabled: true,
        baseCost: 70000,
        freeThreshold: 1000000,
        message: "خرید بالای ۱,۰۰۰,۰۰۰ تومان رایگان",
      };
    }
  }),
});
