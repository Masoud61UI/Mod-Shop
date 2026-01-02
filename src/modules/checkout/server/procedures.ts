import z from "zod";
import { TRPCError } from "@trpc/server";
import type { Order } from "@/src/payload-types";

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

        for (const item of input.items) {
          const product = products.docs.find(
            (p: any) => p.id === item.productId
          );
          if (product && product.inventory) {
            const inventoryItem = product.inventory.find(
              (inv: any) =>
                inv.colorName === item.color && inv.size === item.size
            );
            if (inventoryItem && inventoryItem.stock < item.quantity) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `موجودی محصول ${item.productName} کافی نیست`,
              });
            }
          }
        }

        const subtotal = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const total = subtotal + input.shippingCost;

        const orderItems = input.items.map((item) => {
          const skuParts = [item.productId];
          if (item.color) skuParts.push(item.color);
          if (item.size) skuParts.push(item.size);
          const combinedSku = skuParts.join("-");

          return {
            product: item.productId,
            productName: item.productName,
            variant: {
              colorName: item.color || null,
              size: item.size || null,
              sku: combinedSku,
            },
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          };
        });

        const orderData: Omit<
          Order,
          "id" | "updatedAt" | "createdAt" | "deletedAt"
        > & {
          id?: string;
          updatedAt?: string;
          createdAt?: string;
          deletedAt?: string;
        } = {
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          status: "pending",
          customer: {
            user: ctx.session.user.id,
            fullName: input.customerInfo.fullName,
            phone: input.customerInfo.phone,
            email: input.customerInfo.email || "",
            address: input.customerInfo.address,
            city: input.customerInfo.city,
            postalCode: input.customerInfo.postalCode,
            notes: input.customerInfo.notes || "",
          } as any,
          items: orderItems as any,
          pricing: {
            subtotal: subtotal,
            shippingCost: input.shippingCost,
            discount: 0,
            total: total,
          } as any,
          shipping: {
            method: "standard",
            trackingNumber: "",
            estimatedDelivery: null,
          } as any,
          payment: {
            method: "zarinpal",
            transactionId: "",
            refId: "",
            paymentDate: null,
            paymentStatus: "pending",
          } as any,
          metadata: {
            ip: "",
            userAgent: "",
          } as any,
        };

        const order = await ctx.db.create({
          collection: "orders",
          data: orderData as any, 
        });

        const orderResult = order as any;

        return {
          success: true,
          orderId: orderResult.id,
          orderNumber: orderResult.orderNumber,
          amount: total,
          message: "سفارش با موفقیت ایجاد شد",
          nextStep: "payment",
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
        paymentMethod: z.string().default("zarinpal"),
        transactionId: z.string().optional(),
        refId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.findByID({
          collection: "orders",
          id: input.orderId,
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "سفارش یافت نشد",
          });
        }

        const orderData = order as any;

        if (orderData.customer?.user !== ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "دسترسی غیرمجاز",
          });
        }

        const updateData: Partial<Order> = {
          status: "paid",
          payment: {
            ...orderData.payment,
            method: input.paymentMethod,
            status: "success",
            transactionId: input.transactionId || "",
            refId: input.refId || "",
            paymentDate: new Date().toISOString(),
          } as any,
        };

        await ctx.db.update({
          collection: "orders",
          id: orderData.id,
          data: updateData,
        });

        return {
          success: true,
          orderNumber: orderData.orderNumber,
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
        collection: "orders",
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
