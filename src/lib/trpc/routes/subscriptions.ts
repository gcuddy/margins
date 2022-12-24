import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { t } from '$lib/trpc/t';

export const subscriptions = t.router({
    add: t.procedure
        .use(auth)
        .use(logger)
        .input(
            z.object({
                feeds: z.array(z.object({ url: z.string().url(), title: z.string() })),
            })
        )
        .mutation(({ input, ctx }) =>
            // eg buildFeed, then
            db.feed.upsert({
                where: {
                    id: 0
                },
                create: {

                },
                update: {
                    subscriptions: {
                        // create: 
                    }
                }
            })
            // TODO
            // db.subscription.create({
            //     data: {
            //         title: input.feeds[0].title,
            //         feed: {

            //         }
            //     }
            // })
        ),
});
