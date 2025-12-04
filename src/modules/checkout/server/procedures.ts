import z from "zod";
import { TRPCError } from "@trpc/server";

import { Media } from "@/src/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/src/trpc/init";

export const checkoutRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1, "حداقل یک محصول انتخاب کنید"),
        customerInfo: z.object({
          fullName: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
          phone: z
            .string()
            .regex(/^09[0-9]{9}$/, "شماره موبایل معتبر وارد کنید"),
          email: z.string().email().optional().or(z.literal("")),
          address: z.string().min(10, "آدرس باید حداقل ۱۰ حرف باشد"),
          city: z.string().min(2, "شهر را وارد کنید"),
          postalCode: z.string().regex(/^\d{10}$/, "کد پستی ۱۰ رقمی وارد کنید"),
          notes: z.string().optional(),
        }),
        shippingCost: z.number().min(0),
        items: z.array(
          z.object({
            productId: z.string(),
            productName: z.string(),
            quantity: z.number().min(1),
            price: z.number(),
            color: z.string().optional(),
            size: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const products = await ctx.db.find({
          collection: "products",
          depth: 0,
          where: {
            id: {
              in: input.productIds,
            },
          },
        });

        if (products.totalDocs === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "محصولات یافت نشدند",
          });
        }

        const subtotal = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const total = subtotal + input.shippingCost;

        const order = await ctx.db.create({
          collection: "orders" as any,
          data: {
            customer: {
              ...input.customerInfo,
              user: ctx.session.user.id,
            },
            items: input.items.map((item) => ({
              product: item.productId,
              productName: item.productName,
              variant: {
                colorName: item.color,
                size: item.size,
              },
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
            pricing: {
              subtotal,
              shippingCost: input.shippingCost,
              discount: 0,
              total,
            },
            shipping: {
              method: "standard",
              shippingStatus: "pending",
            },
            payment: {
              method: "pending",
              paymentStatus: "pending",
            },
            status: "pending",
          } as any,
        });

        const orderResult = order as any;
        const orderNumber = orderResult.orderNumber;
        const orderId = orderResult.id;

        return {
          success: true,
          orderId,
          orderNumber,
          amount: total,
          message: "سفارش با موفقیت ایجاد شد",
          nextStep: "pay",
        };
      } catch (error) {
        console.error("Error creating order:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در ایجاد سفارش",
        });
      }
    }),

  markOrderAsPaid: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentMethod: z.string().default("cash"),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const order = (await ctx.db.findByID({
          collection: "orders" as any,
          id: input.orderId,
        })) as any;

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "سفارش یافت نشد",
          });
        }

        if (order.customer?.user !== ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "دسترسی غیرمجاز",
          });
        }

        await ctx.db.update({
          collection: "orders" as any,
          id: order.id,
          data: {
            status: "paid",
            "payment.method": input.paymentMethod,
            "payment.status": "success",
            "payment.transactionId": input.transactionId,
            "payment.paymentDate": new Date().toISOString(),
          } as any,
        });

        return {
          success: true,
          orderNumber: order.orderNumber,
          message: "سفارش با موفقیت پرداخت شد",
        };
      } catch (error) {
        console.error("Error marking order as paid:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در آپدیت سفارش",
        });
      }
    }),

  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    try {
      const orders = await ctx.db.find({
        collection: "orders" as any,
        where: {
          "customer.user": {
            equals: ctx.session.user.id,
          },
        },
        sort: "-createdAt",
        limit: 20,
      });

      return {
        success: true,
        orders: orders.docs,
        total: orders.totalDocs,
      };
    } catch (error) {
      console.error("Error getting user orders:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "خطا در دریافت سفارشات",
      });
    }
  }),

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
          docs: data.docs.map((doc: any) => ({
            ...doc,
            image: (doc.images as { image: Media }[])[0]?.image as Media | null,
          })),
        };
      } catch (error) {
        throw error;
      }
    }),
});
