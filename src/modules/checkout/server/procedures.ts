import z from "zod";

import { TRPCError } from "@trpc/server";

import { Media } from "@/src/payload-types";
import { baseProcedure, createTRPCRouter } from "@/src/trpc/init";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.ids.length === 0) {
        return {
          docs: [],
          totalDocs: 0,
          totalPages: 0,
          page: 1,
          pagingCounter: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        };
      }

      try {
        const data = await ctx.db.find({
          collection: "products",
          depth: 1,
          where: {
            id: {
              in: input.ids,
            },
          },
          pagination: false,
        });

        if (data.docs.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "محصول یافت نشد",
          });
        }

        return {
          ...data,
          docs: data.docs.map((doc) => ({
            ...doc,
            image: (doc.images as { image: Media }[])[0]?.image as Media | null,
          })),
        };
      } catch (error) {
        throw error;
      }
    }),
});
