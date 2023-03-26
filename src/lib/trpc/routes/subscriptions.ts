import { z } from 'zod';

import { db } from '$lib/db';
import { basicSubscriptionSelect } from '$lib/prisma/selects/subscription';
import { protectedProcedure, router } from '$lib/trpc/t';

export const subscriptions = router({
    loadAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.subscription.findMany({
            where: {
                userId: ctx.userId
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
                        id: true,
                        entries: true
                    }
                }
            }
        })
    }),
    list: protectedProcedure
        .query(({ ctx: { userId } }) =>
            db.selectFrom("Subscription as s")
                .innerJoin("Feed as f", "s.feedId", "f.id")
                .select(["s.id", "s.title", "s.feedId", "f.imageUrl", "f.link", "f.feedUrl"])
                .where("s.userId", "=", userId)
                .execute()
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
        ),
    update: protectedProcedure
        .input(z.object({
            data: z.object({
                title: z.string().optional(),
                tags: z.array(z.object({
                    id: z.number().optional(),
                    name: z.string()
                })).optional()
            }),
            id: z.number().optional(),
            feedId: z.number().optional()
        }).refine(data => !!data.id || !!data.feedId, "One of data.id or data.feedid must be set")).mutation(async ({ input, ctx }) => {
            const { data, id, feedId } = input;
            const { userId } = ctx;
            // create any tags that don't exist
            const tagsToCreate = data.tags?.filter(t => !t.id) || [];
            const tags = data.tags?.filter(t => t.id) || [];
            if (tagsToCreate.length) {
                await ctx.prisma.tag.createMany({
                    data: tagsToCreate.map(t => ({
                        name: t.name,
                        userId
                    })),
                    skipDuplicates: true,
                })
            }
            await ctx.prisma.subscription.update({
                where: {
                    id: id ?? undefined,
                    userId_feedId: feedId ? {
                        feedId,
                        userId
                    } : undefined,
                    userId
                },
                data: {
                    title: data.title ?? undefined,
                    tags: data.tags ? {
                        set: data.tags.map(t => ({
                            name_userId: {
                                name: t.name,
                                userId
                            }
                        }))
                    } : undefined,
                }
            })
        })
});
