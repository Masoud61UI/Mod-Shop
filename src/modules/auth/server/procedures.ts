import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";

import { baseProcedure, createTRPCRouter } from "@/src/trpc/init";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    return await ctx.db.auth({ headers });
  }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const [existingEmail, existingUsername] = await Promise.all([
        ctx.db.find({
          collection: "users",
          limit: 1,
          where: { email: { equals: input.email } },
        }),
        ctx.db.find({
          collection: "users",
          limit: 1,
          where: { username: { equals: input.username } },
        }),
      ]);

      if (existingEmail.docs[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "این ایمیل قبلاً ثبت شده است.",
        });
      }

      if (existingUsername.docs[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST", 
          message: "این نام کاربری قبلاً انتخاب شده است.",
        });
      }

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ثبت نام ناموفق! لطفاً مجدداً تلاش کنید.",
        });
      }

      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.db.login({
      collection: "users", 
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "ایمیل یا رمز عبور اشتباه است.",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true, 
      path: "/",
    });

    return data;
  }),
});