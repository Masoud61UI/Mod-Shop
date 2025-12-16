import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z
    .string()
    .regex(/^09[0-9]{9}$/, "شماره موبایل معتبر وارد کنید (09xxxxxxxxx)"),
  subject: z.enum([
    "product-support",
    "order-question",
    "collaboration",
    "feedback",
    "other",
  ]),
  message: z
    .string()
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد"),
  productId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
