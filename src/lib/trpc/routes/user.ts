import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { protectedProcedure, router } from '$lib/trpc/t';

export const user = router({
    data: protectedProcedure
        .input(z.object({
            bookmarks: z.boolean(),
            stylesheets: z.boolean(),
            states: z.boolean(),
            subscriptions: z.boolean(),
        }).partial().optional())
        .query(({ ctx: { userId }, input = {
            bookmarks: true,
            stylesheets: true,
            states: true,
            subscriptions: true
        } }) =>
            db.user.findFirstOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    ...input,
                    subscriptions: input.subscriptions ? {
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
                    } : undefined,
                    bookmarks: input.bookmarks ? {
                        include: {
                            entry: true
                        }
                    } : undefined
                }
            })
        ),
    updateStates: protectedProcedure
        .input(z.object({
            id: z.number(),
            color: z.string().optional(),
            name: z.string().optional()
        }))
        .query(({ ctx: { userId }, input: { id, color, name } }) => db.state.update({
            where: {
                id
            },
            data: {
                color,
                name
            }
        }))
});
