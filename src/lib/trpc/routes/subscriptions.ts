import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { protectedProcedure, router } from '$lib/trpc/t';

export const subscriptions = router({
    list: protectedProcedure
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
    loadEntries: protectedProcedure
        .input(z.object({
            feedId: z.number()
        }))
        .query(({ input, ctx }) => db.entry.findMany({
            where: {
                feedId: input.feedId,
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
                image: true,
                feedId: true
            },
            // TODO: implement cursor, also probably move this to /feeds.loadEntries
        }).then(entries => {
            // TODO: 
            // get the interaction and map it to more useful properties
            return entries.map(e => {
                const { interactions, ...entry } = e;
                const progress = interactions[0]?.progress;
                const unread = !interactions[0]?.is_read;
                return {
                    ...e,
                    progress,
                    unread
                }
            })
        })
        )
});
