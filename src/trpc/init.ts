import { initTRPC, TRPCError } from "@trpc/server";
import { getPayload } from "payload";
import config from "@payload-config";
import superjson from "superjson";
import { cache } from "react";
import { headers as getHeaders } from "next/headers";
import { Payload } from "payload";

type AuthResult = {
  user?: {
    id: string;
    email: string;
    roles?: string[];
    [key: string]: any;
  };
  token?: string;
  exp?: number;
};

export const createTRPCContext = cache(async () => {
  const headersList = await getHeaders();
  
  const payload = await getPayload({ config });
  const authResult = await payload.auth({ headers: headersList }) as AuthResult;

  return {
    payload,
    user: authResult.user || null,
    token: authResult.token,
    res: {
      setHeader: (name: string, value: string) => {
        console.log(`Setting cookie: ${name}=${value}`);
      },
    },
    headers: headersList,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const dbMiddleware = t.middleware(async ({ next }) => {
  const payload = await getPayload({ config });
  
  return next({
    ctx: {
      db: payload,
    },
  });
});

export const baseProcedure = t.procedure.use(dbMiddleware);

export const publicProcedure = baseProcedure;

export const authenticatedProcedure = baseProcedure.use(
  async ({ ctx, next }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });

    return next({
      ctx: {
        ...ctx,
        session: session,
        user: session.user || null,
      },
    });
  }
);

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const session = await ctx.db.auth({ headers });

  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "لطفا ابتدا وارد شوید",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
      user: session.user,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = ctx.user;
  
  if (!user?.roles?.includes("super-admin")) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "شما مجوز دسترسی به این بخش را ندارید",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});