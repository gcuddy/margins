import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { t } from '$lib/trpc/t';

export const user = t.router({
    stylesheets: t.procedure
        .use(auth)
        .use(logger)
        .query(({ ctx: { userId }, input }) =>
            db.stylesheet.findMany({
                where: {
                    userId
                }
            })
        ),
});
