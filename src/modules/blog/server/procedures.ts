import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { blogFilterSchema } from "../schemas";
import { baseProcedure, createTRPCRouter } from "@/src/trpc/init";

export const blogRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.string())
    .query(async ({ input: slug, ctx }) => {
      try {
        const result = await ctx.db.find({
          collection: "blog-posts",
          where: {
            slug: {
              equals: decodeURIComponent(slug),
            },
            status: {
              equals: "published",
            },
          },
          depth: 2,
          limit: 1,
        });

        if (!result.docs.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "مقاله یافت نشد",
          });
        }

        const post = result.docs[0] as any;

        if (post.id) {
          try {
            await ctx.db.update({
              collection: "blog-posts",
              id: post.id,
              data: {
                views: (post.views || 0) + 1,
              },
            });
          } catch (error) {
            console.warn("Failed to update views:", error);
          }
        }

        return {
          ...post,
          formattedPublishedAt: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("fa-IR")
            : null,
        };
      } catch (error) {
        console.error("Error fetching blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت مقاله",
        });
      }
    }),

  getMany: baseProcedure
    .input(blogFilterSchema)
    .query(async ({ input, ctx }) => {
      try {
        const where: any = {
          status: {
            equals: "published",
          },
        };

        if (input.tag) {
          where.tags = {
            contains: input.tag,
          };
        }

        if (input.search) {
          where.or = [
            {
              title: {
                contains: input.search,
              },
            },
            {
              excerpt: {
                contains: input.search,
              },
            },
          ];
        }

        if (input.featured) {
          where.featured = {
            equals: true,
          };
        }

        let sort = "-publishedAt";
        if (input.sort === "oldest") {
          sort = "+publishedAt";
        } else if (input.sort === "most-viewed") {
          sort = "-views";
        } else if (input.sort === "featured") {
          sort = "-featured,-publishedAt";
        }

        const data = await ctx.db.find({
          collection: "blog-posts",
          depth: 1,
          where,
          sort,
          page: input.page,
          limit: input.limit,
        });

        const formattedDocs = data.docs.map((doc: any) => ({
          ...doc,
          formattedPublishedAt: doc.publishedAt
            ? new Date(doc.publishedAt).toLocaleDateString("fa-IR")
            : null,
        }));

        return {
          ...data,
          docs: formattedDocs,
        };
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت مقالات",
        });
      }
    }),

  getRelated: baseProcedure
    .input(
      z.object({
        excludeId: z.string(),
        limit: z.number().min(1).max(6).default(3),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const relatedPosts = await ctx.db.find({
          collection: "blog-posts",
          where: {
            status: {
              equals: "published",
            },
            id: {
              not_equals: input.excludeId,
            },
          },
          limit: input.limit,
          sort: "-publishedAt",
          depth: 1,
        });

        return {
          docs: relatedPosts.docs.map((doc: any) => ({
            ...doc,
            formattedPublishedAt: doc.publishedAt
              ? new Date(doc.publishedAt).toLocaleDateString("fa-IR")
              : null,
          })),
        };
      } catch (error) {
        console.error("Error fetching related posts:", error);
        return { docs: [] };
      }
    }),

  getFeatured: baseProcedure
    .input(z.number().min(1).max(10).default(3))
    .query(async ({ input: limit, ctx }) => {
      try {
        const featuredPosts = await ctx.db.find({
          collection: "blog-posts",
          where: {
            status: {
              equals: "published",
            },
            featured: {
              equals: true,
            },
          },
          limit,
          sort: "-publishedAt",
          depth: 1,
        });

        return {
          docs: featuredPosts.docs.map((doc: any) => ({
            ...doc,
            formattedPublishedAt: doc.publishedAt
              ? new Date(doc.publishedAt).toLocaleDateString("fa-IR")
              : null,
          })),
        };
      } catch (error) {
        console.error("Error fetching featured posts:", error);
        return { docs: [] };
      }
    }),
});
