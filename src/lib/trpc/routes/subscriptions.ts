import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { t } from '$lib/trpc/t';

export const subscriptions = t.router({
    list: t.procedure
        .use(auth)
        .use(logger)
        .query(({ ctx: { userId } }) =>
            db.subscription.findMany({
                where: {
                    userId,
                },
                select: {
                    title: true,
                    id: true,
                    feedId: true,
                    feed: {
                        select: {
                            imageUrl: true,
                            link: true,
                            feedUrl: true,
                        },
                    },
                },
            })
        ),
    loadEntries: t.procedure.use(auth).use(logger)
        .input(z.object({
            feedId: z.number()
        }))
        .query(({ input, ctx }) => db.entry.findMany({
            where: {
                feedId: input.feedId
            },
            orderBy: {
                published: "desc"
            },
            select: {
                interactions: {
                    where: {
                        userId: ctx.userId
                    }
                },
                title: true,
                uri: true,
                author: true,
                summary: true,
                id: true,
                image: true
            },
            // TODO: implement cursor, also probably move this to /feeds.loadEntries
        }).then(entries => {
            // TODO: 
            return entries
        })
        )
    // add: t.procedure
    //     .use(auth)
    //     .use(logger)
    //     .input(
    //         z.object({
    //             feeds: z.array(z.object({ url: z.string().url(), title: z.string() })),
    //         })
    //     )
    //     .mutation(({ input, ctx }) =>
    //         // eg buildFeed, then
    //         db.feed.upsert({
    //             where: {
    //                 id: 0
    //             },
    //             create: {

    //             },
    //             update: {
    //                 subscriptions: {
    //                     // create: 
    //                 }
    //             }
    //         })
    //         // TODO
    //         // db.subscription.create({
    //         //     data: {
    //         //         title: input.feeds[0].title,
    //         //         feed: {

    //         //         }
    //         //     }
    //         // })
    //     ),
});
