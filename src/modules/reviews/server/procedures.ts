import z from "zod";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  authenticatedProcedure,
} from "@/src/trpc/init";

export const reviewsRouter = createTRPCRouter({
  getByProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        status: z.enum(["pending", "published", "rejected"]).optional(),
        limit: z.number().optional().default(50),
        page: z.number().optional().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { productId, status, limit, page } = input;

      const where: any = {
        محصول: {
          equals: productId,
        },
      };

      if (status) {
        where.status = {
          equals: status,
        };
      } else {
        where.status = {
          equals: "published",
        };
      }

      try {
        const reviewsData = await ctx.db.find({
          collection: "reviews" as any,
          where,
          limit,
          page,
          sort: "-createdAt",
        });

        const reviewsWithUserInfo = await Promise.all(
          reviewsData.docs.map(async (review) => {
            let userInfo = null;

            if (review.کاربر) {
              try {
                const userData = await ctx.db.findByID({
                  collection: "users",
                  id: review.کاربر,
                });

                userInfo = {
                  id: userData.id,
                  username: userData.username,
                  email: userData.email,
                  displayName:
                    userData.username ||
                    (userData.email
                      ? userData.email.split("@")[0]
                      : "کاربر ناشناس"),
                };
              } catch (error) {
                console.error("Error fetching user data for review:", error);
                userInfo = {
                  id: review.کاربر,
                  displayName: "کاربر ناشناس",
                };
              }
            }

            return {
              ...review,
              user: userInfo,
            };
          })
        );

        return reviewsWithUserInfo;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت نظرات",
        });
      }
    }),

  getOne: authenticatedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        return null;
      }

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        return null;
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

      let userDisplayName = "کاربر";

      try {
        const userData = (await ctx.db.findByID({
          collection: "users",
          id: ctx.session.user.id,
        })) as any;

        if (userData.name) {
          userDisplayName = userData.name;
        } else if (userData.firstName || userData.lastName) {
          userDisplayName =
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
        } else if (userData.username) {
          userDisplayName = userData.username;
        } else if (userData.email) {
          userDisplayName = userData.email.split("@")[0];
        } else {
          console.log("❌ No suitable field found");
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }

      const review = await ctx.db.create({
        collection: "reviews" as any,
        data: {
          title: `نظر ${userDisplayName}`,
          کاربر: ctx.session.user.id,
          محصول: product.id,
          امتیاز: input.rating,
          توضیحات: input.description,
          status: "pending",
        } as any,
      });

      return review;
    }),
});
