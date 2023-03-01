import { z } from "zod";

import { collectionItemSelect } from "$lib/prisma/selects/collections";
import { _CollectionItemsModel, _CollectionModel } from "$lib/prisma/zod";
import { protectedProcedure, publicProcedure, router } from "$lib/trpc/t";
import type { ChosenIcon } from "$lib/types/icon";
// import { EntryWhereInputObjectSchema } from '$lib/zod/schemas';

const idInput = z.object({
    id: z.number(),
});

export const createCollectionItemSchema = _CollectionItemsModel.partial().omit({
    id: true,
}).required({
    collectionId: true,
});
export const updateCollectionItemScehma = z.object({
    id: z.string(),
    data: _CollectionItemsModel.partial().omit({
        id: true
    }),
})

export const collectionsRouter = router({
    list: protectedProcedure.query(async ({ ctx }) => {
        const collections = await ctx.prisma.collection.findMany({
            where: {
                userId: ctx.userId,
            },
            // with items?

            include: {
                items: {
                    where: {
                        type: "Section"
                    }
                }
            }
        });
        return collections.map((collection) => {
            return {
                ...collection,
                // REVIEW: we could do output validation here, but it seems like overkill
                icon: collection.icon as ChosenIcon,
            };
        });
    }),
    create: protectedProcedure
        .input(
            z.object({
                entryIds: z.number().array().optional().default([]),
                annotationIds: z.number().array().optional().default([]),
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { name, entryIds, annotationIds } = input;
            const collection = await ctx.prisma.collection.create({
                data: {
                    name,
                    userId: ctx.userId,
                    items: {
                        createMany: {
                            data: [
                                ...entryIds.map((entryId) => {
                                    return {
                                        entryId,
                                    };
                                }),
                                ...annotationIds.map((annotationId) => ({
                                    annotationId,
                                })),
                            ],
                        },
                    },
                },
            });
            return { ...collection, icon: collection.icon as ChosenIcon };
        }),
    addItem: protectedProcedure
        .input(
            z.object({
                entryId: z.number().or(z.array(z.number())).optional(),
                annotationId: z.number().or(z.array(z.number())).optional(),
                id: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, entryId, annotationId } = input;
            const entryIds = Array.isArray(entryId) ? entryId : [entryId];
            const annotationIds = Array.isArray(annotationId) ? annotationId : [annotationId];
            const collection = await ctx.prisma.collection.update({
                where: {
                    id,
                },
                data: {
                    items: {
                        createMany: {
                            skipDuplicates: true,
                            data: [
                                ...entryIds.map((entryId) => {
                                    return {
                                        entryId,
                                    };
                                }),
                                ...annotationIds.map((annotationId) => ({
                                    annotationId,
                                })),
                            ],
                        },
                    },
                },
            });
            return { ...collection, icon: collection.icon as ChosenIcon };
            // return _CollectionModel.parse(collection);
        }),
    detail: publicProcedure
        .input(idInput)
        .query(async ({ ctx, input }) => {
            const { id } = input;
            const collection = await ctx.prisma.collection.findUniqueOrThrow({
                where: {
                    id,
                },
                include: {
                    items: {
                        // include: {
                        //     entry: {
                        //         select: {
                        //             id: true,
                        //             title: true,
                        //             uri: true,
                        //             author: true,
                        //             image: true,
                        //             published: true,
                        //             bookmarks: {
                        //                 where: {
                        //                     userId: ctx.userId
                        //                 }
                        //             }
                        //         }
                        //     },
                        //     annotation: true,
                        //     children: {
                        //         include: {
                        //             entry: {
                        //                 select: {
                        //                     id: true,
                        //                     title: true,
                        //                     uri: true,
                        //                     author: true,
                        //                     image: true,
                        //                     published: true,
                        //                     bookmarks: {
                        //                         where: {
                        //                             userId: ctx.userId
                        //                         }
                        //                     }
                        //                 }
                        //             },
                        //             annotation: true,
                        //         },
                        //         orderBy: {
                        //             position: "asc"
                        //         }
                        //     }
                        // },
                        ...collectionItemSelect(ctx.userId, 3),
                        where: {
                            parent: {
                                is: null
                            }
                        },
                        orderBy: {
                            position: "asc"
                        }
                    },
                },
            });
            //REVIEW: should we use an access enum?
            if (collection.userId !== ctx.userId && collection.private) {
                throw new Error("Unauthorized");
            }
            return { ...collection, icon: collection.icon as ChosenIcon };
        }
        ),
    createItem: protectedProcedure
        .input(createCollectionItemSchema)
        .mutation(async ({ ctx, input: data }) => {
            const item = await ctx.prisma.collectionItems.create({
                data,
            });
            return item;
        }),
    updateItem: protectedProcedure
        .input(updateCollectionItemScehma)
        .mutation(async ({ ctx, input }) => {
            const item = await ctx.prisma.collectionItems.update({
                where: {
                    id: input.id
                },
                data: {
                    ...input.data
                }
            })
            return item
        }),
    deleteItem: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(({ ctx, input }) => ctx.prisma.collectionItems.delete({
            where: {
                id: input.id
            },
            select: {
                id: true
            }
        })
        ),
    updateCollection: protectedProcedure
        .input(z.object({
            id: z.number(),
            data: _CollectionModel.partial()
            // data: z.object({
            //     contentData: z.any()
            // })
        }))
        .mutation(async ({ ctx, input }) => ctx.prisma.collection.update({
            where: {
                id: input.id
            },
            data: {
                ...input.data
            }
        }))

});
