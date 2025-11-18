import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر داشته باشد.")
    .max(63, "نام کاربری باید حداکثر ۶۳ کاراکتر داشته باشد.")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "برای نام کاربری فقط از حروف کوچک انگلیسی، عدد و خط تیره استفاده کنید. دقت کنید که اولین و آخرین حرف آن باید حرف یا عدد باشد."
    )
    .refine(
      (val) => !val.includes("--"),
      "استفاده از دو خط تیره پشت سر هم (--) مجاز نیست."
    )
    .transform((val) => val.toLowerCase()),
});
