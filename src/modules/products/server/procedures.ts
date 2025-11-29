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
    console.log("📥 دریافت درخواست برای:", input); // اضافه کنید

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
      // decode URL-encoded slug
      const decodedSlug = decodeURIComponent(input.slug);
      console.log("🔍 جستجو برای slug:", decodedSlug); // اضافه کنید

      const result = await ctx.db.find({
        collection: "products",
        where: {
          slug: {
            equals: decodedSlug, // از decoded استفاده کنید
          },
        },
        depth: 2,
        limit: 1,
      });
      
      console.log("📊 نتیجه جستجو:", result.docs.length, "محصول یافت شد"); // اضافه کنید
      
      if (!result.docs.length) {
        // لیست همه slugs برای debug
        const allProducts = await ctx.db.find({
          collection: "products",
          limit: 10,
          pagination: false,
        });
        console.log("📋 موجودی slugs:", allProducts.docs.map(p => p.slug));
        
        throw new Error(`محصول با slug "${decodedSlug}" یافت نشد`);
      }
      
      product = result.docs[0];
    }

    if (!product) {
      throw new Error("محصول یافت نشد");
    }

    return {
      ...product,
      image: (product.images as { image: Media }[])?.[0]?.image as Media | null,
    };
  }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(8),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "جدیدترین") {
        sort = "-createdAt";
      }

      if (input.sort === "پرفروش‌ترین") {
        sort = "-createdAt";
      }

      if (input.sort === "قدیمی‌ترین") {
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

      if (input.category) {
        const categoryData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoryData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: (doc.images as { image: Media }[])[0]?.image as Media | null,
        })),
      };
    }),
});
