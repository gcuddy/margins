import { TRPCError } from '@trpc/server';

import { t } from '$lib/trpc/t';

export const auth = t.middleware(async ({ next, ctx }) => {
    if (!ctx.session || !ctx.userId || !ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({ ctx });
});
