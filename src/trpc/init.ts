import { initTRPC, TRPCError } from "@trpc/server";
import { getPayload } from "payload";
import config from "@payload-config";
import superjson from "superjson";
import { cache } from "react";
import { headers as getHeaders } from "next/headers";

export const createTRPCContext = cache(async () => {
  const headersList = await getHeaders();

  return {
    userId: "user_123",
    res: {
      setHeader: (name: string, value: string) => {
        console.log(`Setting cookie: ${name}=${value}`);
      },
    },
    headers: headersList,
  };
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config });
  const headersList = await getHeaders();

  return next({
    ctx: {
      db: payload,
      res: {
        setHeader: (name: string, value: string) => {
          console.log(`Setting cookie: ${name}=${value}`);
        },
      },
      headers: headersList,
    },
  });
});

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const session = await ctx.db.auth({ headers });

  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});
