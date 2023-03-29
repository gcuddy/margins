import { initTRPC, TRPCError } from "@trpc/server";
// import { auth } from './middleware/auth';
// import { logger } from './middleware/logger';

import type { Context } from "$lib/trpc/context";
import { transformer } from "./transformer";
export const t = initTRPC.context<Context>().create({
    transformer,
});

export const router = t.router;
export const middleware = t.middleware;

const auth = middleware(async ({ next, ctx }) => {
    console.log(`protectedProcedure`, { ctx })
    if (!ctx.session || !ctx.userId || !ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({ ctx })
});
// const auth = middleware(async ({ next, ctx }) => {
//     if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
//     // return next();
//     return next({
//         ctx: {
//             // user: ctx.user,
//             userId: ctx.userId,
//         },
//     });
// });

const logger = middleware(async ({ path, type, next }) => {
    const start = Date.now();
    const result = await next();
    const ms = Date.now() - start;
    console.log(`[trpc] ${result.ok ? "OK" : "ERR"} ${type} ${path} - ${ms}ms`);
    return result;
});

export const publicProcedure = t.procedure.use(logger);
export const protectedProcedure = t.procedure.use(auth).use(logger);
