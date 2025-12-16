import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { contactSchema } from "../schemas";
import {
  createTRPCRouter,
  authenticatedProcedure,
  adminProcedure,
} from "@/src/trpc/init";

const subjectTypes = [
  "product-support",
  "order-question",
  "collaboration",
  "feedback",
  "other",
] as const;
type SubjectType = (typeof subjectTypes)[number];

export const contactRouter = createTRPCRouter({
  submit: authenticatedProcedure
    .input(contactSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "برای ارسال پیام باید وارد حساب کاربری خود شوید",
          });
        }

        if (!subjectTypes.includes(input.subject as SubjectType)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "موضوع انتخاب شده معتبر نیست.",
          });
        }

        const contactData: any = {
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject as SubjectType,
          message: input.message,
          status: "new",
          read: false,
          userId: ctx.session.user.id,
        };

        if (input.productId) {
          contactData.productId = input.productId;
        }

        const contactMessage = await ctx.db.create({
          collection: "contact-messages",
          data: contactData,
        });

        return {
          success: true,
          messageId: contactMessage.id,
          message: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.",
        };
      } catch (error) {
        console.error("Error submitting contact form:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.message.includes("validation")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "اطلاعات وارد شده معتبر نیست. لطفا بررسی کنید.",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در ارسال پیام. لطفا دوباره تلاش کنید.",
        });
      }
    }),

  getMessages: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
        status: z.enum(["all", "new", "read", "replied"]).default("all"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const where: any = {};
        if (input.status !== "all") {
          where.status = { equals: input.status };
        }

        const messages = await ctx.db.find({
          collection: "contact-messages",
          limit: input.limit,
          page: input.page,
          where,
          sort: "-createdAt",
        });

        const total = await ctx.db.count({
          collection: "contact-messages",
          where,
        });

        const totalNumber = typeof total === "number" ? total : 0;
        const totalPages = Math.ceil(totalNumber / input.limit);

        return {
          messages: messages.docs,
          total: totalNumber,
          totalPages,
          currentPage: input.page,
          hasMore: input.page < totalPages,
        };
      } catch (error) {
        console.error("Error fetching messages:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت پیام‌ها",
        });
      }
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        messageId: z.string(),
        status: z.enum(["read", "replied", "archived"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const updateData: any = {
          status: input.status,
          read: true,
          updatedBy: ctx.session?.user?.id,
        };

        if (input.status === "replied") {
          updateData.repliedAt = new Date().toISOString();
        }

        if (input.adminNotes) {
          updateData.adminNotes = input.adminNotes;
        }

        const updated = await ctx.db.update({
          collection: "contact-messages",
          id: input.messageId,
          data: updateData,
        });

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "پیام مورد نظر یافت نشد",
          });
        }

        return {
          success: true,
          message: "وضعیت پیام با موفقیت بروزرسانی شد",
        };
      } catch (error) {
        console.error("Error updating message status:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در بروزرسانی وضعیت پیام",
        });
      }
    }),

  getMessage: adminProcedure
    .input(z.string())
    .query(async ({ input: messageId, ctx }) => {
      try {
        const message = await ctx.db.findByID({
          collection: "contact-messages",
          id: messageId,
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "پیام مورد نظر یافت نشد",
          });
        }

        return { message };
      } catch (error) {
        console.error("Error fetching message:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت پیام",
        });
      }
    }),

  getMyMessages: authenticatedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        page: z.number().min(1).default(1),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.session?.user?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "کاربر یافت نشد",
          });
        }

        const messages = await ctx.db.find({
          collection: "contact-messages",
          limit: input.limit,
          page: input.page,
          where: {
            userId: { equals: ctx.session.user.id },
          },
          sort: "-createdAt",
        });

        const total = await ctx.db.count({
          collection: "contact-messages",
          where: {
            userId: { equals: ctx.session.user.id },
          },
        });

        const totalNumber = typeof total === "number" ? total : 0;
        const totalPages = Math.ceil(totalNumber / input.limit);

        return {
          messages: messages.docs,
          total: totalNumber,
          totalPages,
          currentPage: input.page,
          hasMore: input.page < totalPages,
        };
      } catch (error) {
        console.error("Error fetching user messages:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در دریافت پیام‌های شما",
        });
      }
    }),
});