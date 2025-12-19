import z from "zod";
import { Sort, Where } from "payload";

import { sortValues } from "../searchParams";

import { Category, Media } from "@/src/payload-types";
import { baseProcedure, createTRPCRouter } from "@/src/trpc/init";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new Error("ایدی یا اسلاگ محصول الزامی است");
      }

      let product;

      if (input.id) {
        product = await ctx.db.findByID({
          collection: "products",
          id: input.id,
          depth: 2,
        });
      } else if (input.slug) {
        const decodedSlug = decodeURIComponent(input.slug);
        console.log("🔍 جستجو برای slug:", decodedSlug);

        const result = await ctx.db.find({
          collection: "products",
          where: {
            slug: {
              equals: decodedSlug,
            },
          },
          depth: 2,
          limit: 1,
        });

        if (!result.docs.length) {
          const allProducts = await ctx.db.find({
            collection: "products",
            limit: 10,
            pagination: false,
          });

          throw new Error(`محصول با slug "${decodedSlug}" یافت نشد`);
        }

        product = result.docs[0];
      }

      if (!product) {
        throw new Error("محصول یافت نشد");
      }

      const reviews = await ctx.db.find({
        collection: "reviews" as any,
        pagination: false,
        where: {
          and: [
            {
              محصول: {
                equals: product.id,
              },
            },
            {
              status: {
                equals: "published",
              },
            },
          ],
        },
      });

      const publishedReviews = reviews.docs.filter(
        (review) => review.status === "published"
      );

      const reviewRating =
        publishedReviews.length > 0
          ? publishedReviews.reduce((acc, review) => acc + review.امتیاز, 0) /
            publishedReviews.length
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (publishedReviews.length > 0) {
        publishedReviews.forEach((review) => {
          const rating = review.امتیاز;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round(
            (count / publishedReviews.length) * 100
          );
        });
      }

      return {
        ...product,
        image: (product.images as { image: Media }[])?.[0]
          ?.image as Media | null,
        reviewRating,
        reviewCount: publishedReviews.length,
        ratingDistribution,
      };
    }),

  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(8),
        search: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "جدیدترین") {
        sort = "-createdAt";
      } else if (input.sort === "قدیمی‌ترین") {
        sort = "+createdAt";
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.featured) {
        where.featured = {
          equals: true,
        };
      }

      if (input.category) {
        const categoryData = await ctx.db.find({
          collection: "categories",
          depth: 2,
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const category = categoryData.docs[0];

        if (category) {
          const categoryIds = [category.id];

          if (category.subcategories && category.subcategories.docs) {
            category.subcategories.docs.forEach((sub: any) => {
              categoryIds.push(sub.id);
            });
          }

          where["or"] = [
            {
              category: {
                in: categoryIds,
              },
            },
            {
              subcategory: {
                in: categoryIds,
              },
            },
          ];
        } else {
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
      }

      if (input.search && input.search.trim()) {
        const searchTerm = input.search.trim();
        where["name"] = {
          contains: searchTerm,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      const dataWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
          const reviewsData = await ctx.db.find({
            collection: "reviews" as any,
            where: {
              and: [
                {
                  محصول: {
                    equals: doc.id,
                  },
                },
                {
                  status: {
                    equals: "published",
                  },
                },
              ],
            },
            pagination: false,
          });

          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + review.امتیاز,
                    0
                  ) / reviewsData.totalDocs,
          };
        })
      );

      return {
        ...data,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: (doc.images as { image: Media }[])[0]?.image as Media | null,
        })),
      };
    }),
});
