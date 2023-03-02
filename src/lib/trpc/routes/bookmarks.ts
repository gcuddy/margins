import dayjs from "dayjs";
import { match } from "ts-pattern";
import { z } from "zod";

import { uploadFile } from "$lib/backend/s3.server";
import { db } from "$lib/db";
import { _BookmarkModel } from "$lib/prisma/zod";
import { protectedProcedure, router } from "$lib/trpc/t";
import { Metadata } from "$lib/web-parser";

async function generateScreenshot(url: string) {
    const res = await fetch(`https://admirable-croissant-98e7d9.netlify.app/${encodeURIComponent(url)}/large/1:1/larger/`);
    const image = await res.arrayBuffer();
    if (!image) {
        throw new Error("No image");
    }
    const Key = `screenshots/${url.replace(/[^a-zA-Z0-9]/g, "_")}.png`
    const data = await uploadFile({
        Key,
        // @ts-expect-error
        Body: image
    })
    return Key
}

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
            const screenshot = !!input.article?.screenshot;
            const needScreenshot = input.article?.type === "bookmark";
            function screenshotReducer() {
                return match([screenshot, needScreenshot])
                    .with([false, true], () => generateScreenshot(input.url as string))
                    .with([true, true], () => input.article?.screenshot as string)
                    .otherwise(() => undefined);
            }
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
                    screenshot: await screenshotReducer(),
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
                uri: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { stateId, id, entryId, uri } = input;
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
                        uri_entryId_userId: {
                            uri: input.uri || '',
                            entryId: entryId || -1,
                            userId,
                        }
                    },
                    create: {
                        stateId,
                        entryId,
                        uri,
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
                data: _BookmarkModel.partial(),
                uri: z.string().optional(),
            }).refine(input => !!input.id || !!input.entryId, "Either id or entryId is required")
        )
        .mutation(async ({ ctx, input }) => {
            const { id, entryId, data, uri } = input;
            const { userId } = ctx;
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
            } else if (uri) {
                const { stateId, interactionId, favoriteId, entryId, id, ...rest } = data;
                return ctx.prisma.bookmark.upsert({
                    where: {
                        // id: id ?? undefined,
                        // entryId: entryId ?? undefined,
                        // userId,
                        uri_entryId_userId: {
                            uri: input.uri || '',
                            entryId: entryId || -1,
                            userId,
                        }
                    },
                    update: data,
                    create: {
                        // ...rest,
                        entry: {
                            connect: {
                                uri
                            }
                        },
                        user: {
                            connect: {
                                id: userId
                            }
                        },
                        state: stateId ? {
                            connect: {
                                id: stateId
                            }
                        } : undefined
                        // uri,
                        // userId
                    }
                });
            }
        }),
    screenshot: protectedProcedure
        .input(z.object({
            id: z.number(),
        })).mutation(async ({ ctx, input }) => {
            const { id } = input;
            const bookmark = await ctx.prisma.bookmark.findUnique({
                where: {
                    id,
                },
                select: {
                    screenshot: true,
                    uri: true,
                },
            });
            if (!bookmark) {
                throw new Error("Bookmark not found");
            }
            if (!bookmark.screenshot && bookmark.uri) {
                const screenshot = await generateScreenshot(bookmark.uri);
                await ctx.prisma.bookmark.update({
                    where: {
                        id,
                    },
                    data: {
                        screenshot,
                    },
                });
                return screenshot;
            }
            return bookmark.screenshot;
        })
});
