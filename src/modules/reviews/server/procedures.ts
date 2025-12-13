import z from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/src/trpc/init";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "محصولی یافت نشد!",
        });
      }

      const reviewsData = await ctx.db.find({
        collection: "reviews" as any,
        limit: 1,
        where: {
          and: [
            {
              محصول: {
                equals: product.id,
              },
            },
            {
              کاربر: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const review = reviewsData.docs[0];

      if (!review) {
        return null;
      }

      return review;
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "امتیاز الزامی است" }).max(5),
        description: z.string().min(1, { message: "توضیحات الزامی است" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "محصولی یافت نشد!",
        });
      }

      const existingReviewsData = await ctx.db.find({
        collection: "reviews" as any,
        limit: 1,
        where: {
          and: [
            {
              محصول: {
                equals: input.productId,
              },
            },
            {
              کاربر: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "شما قبلاً برای این محصول نظر داده‌اید!",
        });
      }

      const review = await ctx.db.create({
        collection: "reviews" as any,
        data: {
          title: `نظر کاربر ${ctx.session.user.id}`,
          کاربر: ctx.session.user.id,
          محصول: product.id,
          امتیاز: input.rating,
          توضیحات: input.description,
          status: "pending", 
        } as any,
      });

      return review;
    }),

  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "امتیاز مورد نیاز است!" }).max(5),
        description: z.string().min(1, { message: "توضیحات مورد نیاز است!" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userReviews = await ctx.db.find({
        collection: "reviews" as any,
        where: {
          and: [
            {
              id: {
                equals: input.reviewId,
              },
            },
            {
              کاربر: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
        limit: 1,
      });

      if (userReviews.totalDocs === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "نظری یافت نشد یا شما مجاز به ویرایش آن نیستید!",
        });
      }

      const updatedReview = await ctx.db.update({
        collection: "reviews" as any,
        id: input.reviewId,
        data: {
          امتیاز: input.rating,
          توضیحات: input.description,
          status: "pending",
        } as any,
      });

      return updatedReview;
    }),
});
