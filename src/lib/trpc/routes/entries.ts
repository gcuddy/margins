import { DocumentType, RelationType } from "@prisma/client"
import { fuzzy } from "fast-fuzzy";
import { z } from "zod";

import { db } from "$lib/db";
import { annotationSelect } from "$lib/prisma/selects/annotations";
import type { EntryExtendedSchema } from "$lib/prisma/zod-utils";
import { protectedProcedure, router } from "$lib/trpc/t";
import { LocationSchema } from "$lib/types/schemas/Locations";
import { Metadata } from "$lib/web-parser";
import type { Recipe } from "$lib/web-parser/recipe";

const idInput = z.object({
    id: z.number(),
});

export const entriesRouter = router({
    listBookmarks: protectedProcedure
        .input(
            z
                .object({
                    location: LocationSchema.or(z.literal("all")),
                    stateId: z.number().optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            console.log(`listBookmarks`, input)
            const { userId, user } = ctx;
            const entries = await ctx.prisma.entry
                .findMany({
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        // html: true,
                        screenshot: true,
                        image: true,
                        type: true,
                        enclosureUrl: true,
                        duration: true,
                        uri: true,
                        published: true,
                        summary: true,
                        updatedAt: true,
                        annotations: {
                            where: {
                                // type: 'note',
                                userId,
                            },
                        },
                        tags: {
                            select: {
                                id: true,
                            },
                            where: {
                                userId
                            }
                        },
                        bookmarks: {
                            where: {
                                userId,
                            },
                            include: {
                                state: true,
                            },
                        },
                        interactions: {
                            where: {
                                userId
                            }
                        },
                        feed: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    },
                    orderBy: { updatedAt: "desc" },
                    where: {
                        bookmarks: {
                            some: {
                                user: {
                                    id: userId
                                },
                                state: {
                                    type: input?.location !== "all" ? input?.location : undefined
                                }
                            },
                        },
                    },
                    take: 20,
                })
                .then((entries) =>
                    entries.map((e) => {
                        const { bookmarks, ...entry } = e;
                        return { ...entry, bookmark: bookmarks[0] };
                    })
                );
            return entries;
        }),
    load: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(({ ctx: { userId }, input: { id } }) =>
            db.entry
                .findUniqueOrThrow({
                    where: {
                        id,
                    },
                    select: {
                        title: true,
                        html: true,
                        author: true,
                        id: true,
                        feedId: true,
                        extended: true,
                        enclosureUrl: true,
                        tmdbId: true,
                        youtubeId: true,
                        tmdbData: true,
                        googleBooksId: true,
                        podcastIndexId: true,
                        type: true,
                        image: true,
                        screenshot: true,
                        published: true,
                        recipe: true,
                        original: true,
                        uri: true,
                        bookmarks: {
                            where: {
                                userId,
                            },
                            include: {
                                state: true,
                            },
                        },
                        tags: {
                            where: {
                                userId
                            }
                        },
                        annotations: {
                            where: {
                                deleted: null,
                                userId
                            },
                            include: {
                                creator: {
                                    select: {
                                        username: true,
                                    },
                                },
                                children: {
                                    // don't get children who are deleted and don't have any children which aren't deleted
                                    where: {
                                        deleted: null,
                                        OR: [
                                            {
                                                children: {
                                                    every: {
                                                        deleted: null,
                                                    },
                                                },
                                            },
                                            {
                                                children: {
                                                    none: {},
                                                },
                                            },
                                        ],
                                    },
                                    select: {
                                        ...annotationSelect,
                                        _count: {
                                            select: {
                                                children: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        interactions: {
                            where: {
                                userId,
                            },
                        },
                        log: {
                            where: {
                                userId,
                                date: {
                                    // Today
                                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                }
                            }
                        },
                        relations: {
                            where: {
                                userId
                            },
                            select: {
                                type: true,
                                relatedEntry: {
                                    select: {
                                        title: true,
                                        id: true,
                                        type: true
                                    }
                                }
                            }
                        },
                        back_relations: {
                            where: {
                                userId
                            },
                            select: {
                                type: true,
                                entry: {
                                    select: {
                                        title: true,
                                        id: true,
                                        type: true
                                    }
                                }
                            }
                        },
                        // REVIEW: this whole thing might be too expqensive, maybe split into separate calls?
                        // CollectionItems: {
                        //     where: {
                        //         collection: {
                        //             userId
                        //         }
                        //     }
                        // }
                    },
                })
                .then((entry) => {
                    const html = entry.html
                    // const html = entry.data[0]?.html || entry.html;
                    const { interactions, bookmarks, ...finalEntry } = entry;
                    const bookmark = entry.bookmarks[0];
                    const context = entry.bookmarks[0]?.context;
                    const progress = interactions[0]?.progress;
                    const unread = !interactions[0]?.is_read;
                    return {
                        ...finalEntry,
                        bookmark,
                        html,
                        context,
                        // custom: !!entry.data.length,
                        progress,
                        unread,
                        interactions,
                        recipe: entry.recipe as null | Recipe,
                        extended: entry.extended as z.infer<typeof EntryExtendedSchema> | null,
                    };
                })
        ),
    loadData: protectedProcedure
        .input(
            idInput.extend({
                // todo: maybe this shuold be select instead for prisma ergonomics
                data: z
                    .object({
                        annotations: z.boolean(),
                        content: z.boolean(),
                        context: z.boolean().optional(),
                    })
                    .partial(),
            })
        )
        .query(({ ctx, input: { id, data } }) =>
            db.entry
                .findUniqueOrThrow({
                    where: {
                        id,
                    },
                    select: {
                        annotations: data.annotations,
                        context: data.context || false,
                        html: data.content,
                        data: data.content
                            ? {
                                where: {
                                    userId: ctx.userId,
                                },
                            }
                            : undefined,
                    },
                    // todo: allow no select to be passed in to get everything
                })
                .then((data) => {
                    console.log({ data });
                    const entryData = data.data[0]; //should be only one per user
                    return {
                        html: data.html,
                        annotations: data.annotations,
                        data: entryData,
                        context: data.context,
                    };
                })
        ),
    getAnnotations: protectedProcedure.input(idInput).query(({ input: { id } }) =>
        db.entry
            .findUniqueOrThrow({
                where: {
                    id,
                },
                select: {
                    annotations: true,
                },
            })
            .then((data) => data.annotations)
    ),
    getCollections: protectedProcedure.input(idInput).query(async ({ ctx, input: { id } }) => {
        const collections = await ctx.prisma.collection.findMany({
            where: {
                items: {
                    some: {
                        entryId: id
                        // TODO: public vs private, per user, etc
                    }
                }
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })
        return collections
    }),
    addData: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                article: Metadata.extend({
                    html: z.string().optional(),
                }),
            })
        )
        .mutation(({ ctx, input }) =>
            db.entryData.upsert({
                where: {
                    entryId_userId: {
                        entryId: input.id,
                        userId: ctx.userId,
                    },
                },
                create: {
                    entryId: input.id,
                    userId: ctx.userId,
                    html: input.article.html,
                },
                update: {
                    html: input.article.html,
                },
            })
        ),
    markAsRead: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(({ ctx: { userId }, input: { id } }) =>
            db.interaction.upsert({
                where: {
                    userId_entryId: {
                        userId,
                        entryId: id,
                    },
                },
                create: {
                    is_read: true,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    entry: {
                        connect: {
                            id,
                        },
                    },
                },
                update: {
                    is_read: true,
                },
            })
        ),
    updateInteraction: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                progress: z.number(),
                is_read: z.boolean().optional(),
            })
        )
        .mutation(({ ctx: { userId }, input: { id, progress, is_read } }) =>
            db.entry.update({
                where: {
                    id,
                },
                data: {
                    interactions: {
                        upsert: {
                            where: {
                                userId_entryId: {
                                    userId,
                                    entryId: id,
                                },
                            },
                            create: {
                                progress,
                                is_read,
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                            },
                            update: {
                                progress,
                                is_read,
                            },
                        },
                    },
                },
                select: {
                    id: true
                }
            })
        ),
    update: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                // TODO: make this more specific
                data: z.object({}).passthrough(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx;
            const { id, data } = input;
            return await prisma.entry.update({
                where: {
                    id,
                },
                data,
            });
        }),
    byFeed: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
        const entries = await ctx.prisma.entry
            .findMany({
                where: {
                    feedId: input.id,
                },
                orderBy: [
                    {
                        published: "desc",
                    },
                ],
                include: {
                    interactions: {
                        where: {
                            userId: ctx.userId,
                        },
                    },
                },
            })
            .then((entries) => {
                return entries.map((e) => {
                    const unread = !e.interactions[0]?.is_read;
                    return {
                        ...e,
                        unread,
                    };
                });
            });
        return { entries };
    }),

    byFeeds: protectedProcedure
        .input(
            z.object({
                ids: z.number().array(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { ids } = input;
            const entries = await ctx.prisma.entry.findMany({
                where: {
                    feedId: {
                        in: ids,
                    },
                },
            });
            return entries;
        }),
    listForUserSubscriptions: protectedProcedure
        .input(
            z
                .object({
                    take: z.number().min(1).max(100).default(50),
                    cursor: z.number().nullish(),
                })
                .default({
                    take: 50,
                    cursor: undefined,
                })
        )
        .query(async ({ ctx, input }) => {
            const { cursor, take } = input;
            console.log(`listforusersubscriptions`, { input });
            const { prisma, userId } = ctx;
            const entries = await prisma.entry.findMany({
                take: take + 1,
                where: {
                    feed: {
                        subscriptions: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
                cursor: cursor
                    ? {
                        id: cursor,
                    }
                    : undefined,
                orderBy: {
                    published: "desc",
                },
            });
            let nextCursor: typeof cursor | undefined = undefined;
            if (entries.length > take) {
                const nextItem = entries.pop();
                nextCursor = nextItem!.id;
            }
            return { entries, nextCursor };
        }),
    filter: protectedProcedure
        .input(
            z
                .object({
                    bookmarks: z.boolean().default(true),
                    feeds: z.boolean().default(true),
                    // TODO: type this - prisma/zod entrywhereinput
                    where: z.any(),
                })
                .refine((e) => !!e.bookmarks || !!e.feeds, {
                    message: "One of `bookmarks` or `feeds` must be true.",
                })
        )
        .query(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { where, bookmarks, feeds } = input;
            const entries = await ctx.prisma.entry.findMany({
                where: {
                    AND: {
                        ...where,
                    },
                    OR: [
                        {
                            bookmarks: bookmarks
                                ? {
                                    some: {
                                        userId,
                                    },
                                }
                                : undefined,
                        },
                        {
                            feed: feeds
                                ? {
                                    subscriptions: {
                                        some: {
                                            userId,
                                        },
                                    },
                                }
                                : undefined,
                        },
                    ],
                },
                take: 25,
                include: {
                    bookmarks: {
                        where: {
                            userId,
                        },
                    },
                    // interactions: {
                    // 	where: {

                    // 	}
                    // }
                },
            });
            return entries.map((e) => ({ ...e, bookmark: e.bookmarks?.[0] }));
        }),
    byTag: protectedProcedure
        .input(
            z.object({
                tag: z.string(),
                // username: z.string(),
                /// Whether or not to just return bookmarks
                boookmarks: z.boolean().default(false),
            })
        )
        .query(async ({ ctx, input }) => {
            const { tag } = input;
            // REVIEW: I think that the querying username thing from a public perspective should go in public router
            // const authed = ctx.user?.username === username;
            const entries = await ctx.prisma.entry.findMany({
                where: {
                    tags: {
                        some: {
                            name: tag,
                            userId: ctx.userId,
                        },
                    },
                },
            });
        }),
    search: protectedProcedure.input(z.object({
        query: z.string(),
        title: z.boolean().default(true),
        text: z.boolean().default(true),
        author: z.boolean().default(true),
    })).query(async ({ ctx, input }) => {
        const { userId } = ctx;
        const { query: search, title, text, author } = input;
        console.log({ input })
        // TODO: massage results by relevance by weighting title > author > text
        const entries = await ctx.prisma.entry.findMany({
            where: {
                text: text ? {
                    search,
                } : undefined,
                title: title ? {
                    search,
                } : undefined,
                author: author ? {
                    search,
                } : undefined,
                // REVIEW: where bookmark or feed related — is this what we want?
                OR: [
                    {
                        bookmarks: {
                            some: {
                                userId,
                            },
                        },
                    },
                    {
                        feed: {
                            // REVIEW: should context get user.subscriptions instead of nested query here?
                            subscriptions: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                ],
            },
            // TODO: order by relevance (when Prisma makes that available for mysql)
            // @see https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#sort-by-relevance-postgresql
            // orderByy: {
            //     _relevance:
            // }
        });
        const weights = {
            title: 3,
            author: 2,
            text: 1
        }
        entries.sort((a, b) => {
            const scoreA = weights.title * (a.title ? fuzzy(search, a.title) : 0) + weights.author * (a.author ? fuzzy(search, a.author) : 0) + weights.text * (a.text ? fuzzy(search, a.text) : 0);
            const scoreB = weights.title * (b.title ? fuzzy(search, b.title) : 0) + weights.author * (b.author ? fuzzy(search, b.author) : 0) + weights.text * (b.text ? fuzzy(search, b.text) : 0);
            return scoreB - scoreA;
        })
        return entries;
    }),
    delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
        return ctx.prisma.entry.delete({
            where: {
                id: input,
            },
        });
    }),
    create: protectedProcedure
        .input(
            z.object({
                data: z.object({
                    id: z.number().optional(),
                    tmdbId: z.number().optional(),
                    title: z.string(),
                    // todo
                }).passthrough()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const entry = await ctx.prisma.entry.upsert({
                where: {
                    id: input.data.id ? input.data.id : -1,
                    tmdbId: input.data.tmdbId ? input.data.tmdbId : -1,
                },
                create: {
                    ...input.data,
                },
                update: {
                    ...input.data,
                },
                select: {
                    id: true,
                },
            });
            return entry;
        }),
    createRelation: protectedProcedure
        .input(
            z.object({
                entryId: z.number(),
                relatedEntryId: z.number(),
                type: z.nativeEnum(RelationType).default("Related"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { entryId, relatedEntryId, type } = input;
            const userId = ctx.userId;
            const relation = await ctx.prisma.relation.upsert({
                where: {
                    userId_entryId_relatedEntryId: {
                        userId,
                        entryId,
                        relatedEntryId,
                    }
                },
                create: {
                    entryId,
                    relatedEntryId,
                    type,
                    userId
                },
                update: {
                    type,
                },
                select: {
                    id: true,
                },
            });
            return relation;
        }),
    list: protectedProcedure
        .input(z.object({
            type: z.nativeEnum(DocumentType).optional(),
            // etc...
        })).query(async ({ ctx, input }) => {
            const { userId } = ctx;
            return await ctx.prisma.entry.findMany({
                where: {
                    AND: input,
                    OR: [
                        {
                            bookmarks: {
                                some: {
                                    userId,
                                },
                            }

                        },
                        {
                            feed: {
                                subscriptions: {
                                    some: {
                                        userId,
                                    },
                                },
                            }
                        },
                    ],
                },
            })
        })
});