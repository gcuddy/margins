import dayjs from "dayjs";
import { z } from "zod";

import { db } from "$lib/db";
import { _BookmarkModel } from "$lib/prisma/zod";
import { protectedProcedure, router } from "$lib/trpc/t";
import { Metadata } from "$lib/web-parser";

export const bookmarks = router({
    add: protectedProcedure
        .input(
            z
                .object({
                    url: z.string().optional(),
                    entryId: z.number().optional(),
                    article: Metadata.extend({
                        html: z.string().optional(),
                        text: z.string().optional(),
                        wordCount: z.number().optional(),
                        image: z.string().nullish().default("")
                    })
                        .passthrough()
                        .optional(),
                    tags: z.object({ name: z.string(), id: z.number().optional() }).array().optional(),
                    note: z.string().optional(),
                    context: z
                        .object({
                            url: z.string().optional(),
                            entryId: z.number().optional(),
                        })
                        .optional(),
                    stateId: z.number().optional(),
                    collectionId: z.number().optional(),
                })
                .refine((data) => !!data.url || !!data.entryId, "Need either URL or entryId")
        )
        .mutation(async ({ input, ctx }) => {
            const entry = await ctx.prisma.entry.upsert({
                where: {
                    uri: !input.entryId ? input.url : undefined,
                    id: input.entryId,
                },
                create: {
                    type: "article",
                    ...input.article,
                    published: input.article ? dayjs(input.article.published).toDate() : undefined,
                    uri: input.url,
                    relations: input.context?.entryId ? {
                        create: {
                            type: "SavedFrom",
                            userId: ctx.userId,
                            relatedEntryId: input.context.entryId
                        }
                    } : undefined,
                    CollectionItems: input.collectionId ? {
                        create: {
                            collectionId: input.collectionId
                        },
                    } : undefined,
                },
                update: {
                    // TODO
                    // DO I really want to do that?
                    ...input.article,
                    relations: input.context?.entryId ? {
                        create: {
                            type: "SavedFrom",
                            userId: ctx.userId,
                            relatedEntryId: input.context.entryId
                        }
                    } : undefined,
                    CollectionItems: input.collectionId ? {
                        create: {
                            collectionId: input.collectionId
                        },
                    } : undefined,
                }
            })
            const bookmark = await ctx.prisma.bookmark.upsert({
                where: {
                    uri_entryId_userId: {
                        uri: input.url as string,
                        entryId: input.entryId || -1,
                        userId: ctx.userId,
                    }
                },
                create: {
                    user: {
                        connect: {
                            id: ctx.userId,
                        },
                    },
                    context: input.context,
                    entry: {
                        connect: {
                            id: entry.id,
                        }
                    },
                    collections: input.collectionId ? {
                        connect: {
                            id: input.collectionId
                        }
                    } : undefined,
                    state: input.stateId
                        ? {
                            connect: {
                                id: input.stateId,
                            },
                        }
                        : {
                            connect: {
                                // TODO: this should not be nullable
                                id: ctx.user?.default_state_id,
                            },
                        },
                },
                update: {
                    // TODO
                },
            });
            return bookmark;
        }
        ),
    getContext: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(({ input: { id }, ctx: { userId } }) =>
            db.bookmark.findUniqueOrThrow({
                where: {
                    id,
                    userId,
                },
                select: {
                    context: true,
                },
            })
        ),
    byEntry: protectedProcedure
        .input(
            z.object({
                entryId: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { entryId } = input;
            const bookmark = await ctx.prisma.bookmark.findFirst({
                where: {
                    entryId,
                },
            });
            return bookmark;
        }),
    archive: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
        // REVIEW: this gets the "first" archive state. this is what we want, right?
        const state = await ctx.prisma.state.findFirst({
            where: {
                userId: ctx.userId,
                type: "archive"
            }
        })
        // TODO: default_arhchieve_state_id ?
        // const stateId = ctx.user?.states.find((s) => s.type === "archive")?.id;
        return ctx.prisma.bookmark.update({
            where: {
                id: input,
            },
            data: {
                stateId: state?.id,
            },
        });
    }),
    updateState: protectedProcedure
        .input(
            z.object({
                stateId: z.number(),
                id: z.number().nullish(),
                entryId: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { stateId, id, entryId } = input;
            const { userId } = ctx;
            console.log({ stateId, id });
            if (id) {
                // update
                return ctx.prisma.bookmark.update({
                    where: {
                        id,
                        userId,
                    },
                    data: {
                        stateId,
                    },
                });
            } else {
                return ctx.prisma.bookmark.upsert({
                    where: {
                        entryId,
                        userId,
                    },
                    create: {
                        stateId,
                        entryId,
                        userId,
                    },
                    update: {
                        stateId,
                    },
                });
                // create
            }
            // console.log({ bookmark })
            // return {
            // 	success: true
            // }
        }),
    updateStates: protectedProcedure
        .input(
            z.object({
                stateId: z.number(),
                ids: z.object({
                    bookmark: z.number().optional(),
                    entry: z.number(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { stateId } = input;
            // TODO:
            // ctx.prisma.bookmark.updateMany({
            // 	where: {

            // 	}
            // })
            // console.log({ stateId, id })
            // if (id) {
            // 	// update
            // 	return ctx.prisma.bookmark.update({
            // 		where: {
            // 			id
            // 		},
            // 		data: {
            // 			stateId
            // 		}
            // 	});
            // } else {
            // 	return ctx.prisma.bookmark.create({
            // 		data: {
            // 			stateId,
            // 			entryId,
            // 			userId: ctx.userId
            // 		}
            // 	})
            // 	// create
            // }
        }),
    delete: protectedProcedure.input(z.number().or(z.number().array())).mutation(async ({ ctx, input }) => {
        console.log({ input });
        if (Array.isArray(input)) {
            return ctx.prisma.bookmark.deleteMany({
                where: {
                    id: {
                        in: input,
                    },
                },
            });
        } else {
            return ctx.prisma.bookmark.delete({
                where: {
                    id: input,
                    userId: ctx.userId,
                },
            });
        }
    }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.number().or(z.number().array()).optional(),
                entryId: z.number().or(z.number().array()).optional(),
                data: _BookmarkModel.partial()
            }).refine(input => !!input.id || !!input.entryId, "Either id or entryId is required")
        )
        .mutation(async ({ ctx, input }) => {
            const { id, entryId, data } = input;
            if (Array.isArray(id) || Array.isArray(entryId)) {
                return ctx.prisma.bookmark.updateMany({
                    where: {
                        id: Array.isArray(id) ? {
                            in: id,
                        } : undefined,
                        entryId: Array.isArray(entryId) ? {
                            in: entryId,
                        } : undefined,
                        userId: ctx.userId,
                    },
                    data,
                });
            } else {
                return ctx.prisma.bookmark.update({
                    where: {
                        id: id ?? undefined,
                        entryId: entryId ?? undefined,
                        userId: ctx.userId,
                    },
                    data,
                });
            }
        })
});