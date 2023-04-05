import { z } from "zod";

import { collectionItemSelect } from "$lib/prisma/selects/collections";
import { _CollectionItemsModel, _CollectionModel } from "$lib/prisma/zod";
import { protectedProcedure, publicProcedure, router } from "$lib/trpc/t";
import type { ChosenIcon } from "$lib/types/icon";
import type { Annotation, CollectionItems } from "$lib/prisma/kysely/types";
import type { Insertable } from "kysely";
import { TRPCError } from "@trpc/server";
import { nanoid } from "$lib/nanoid";
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
        const collections = await ctx.db.selectFrom("Collection as c")
            // .leftJoin("CollectionItems as ci", (join) => join.onRef("ci.collectionId", "=", "c.id").on("ci.type", "=", "Section"))
            .selectAll()
            .where("c.userId", "=", ctx.userId)
            .orderBy("c.updatedAt", "desc")
            .execute();

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
                annotationIds: z.string().array().optional().default([]),
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { name, entryIds, annotationIds } = input;
            const collection = await ctx.db.insertInto("Collection")
                .values({
                    name,
                    userId: ctx.userId,
                    updatedAt: new Date(),
                })
                .executeTakeFirstOrThrow();
            const collectionId = Number(collection.insertId);
            if (!collectionId) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not create collection",
                });
            }
            // quickly select the collection we just created
            const _collection = await ctx.db.selectFrom("Collection")
                .selectAll()
                .where("id", "=", collectionId)
                .executeTakeFirstOrThrow();
            type CIInsert = Insertable<CollectionItems>;
            const insert_arr: CIInsert[] = []
            for (const entryId of entryIds) {
                insert_arr.push({
                    collectionId,
                    entryId,
                    type: "Entry",
                    id: nanoid(),
                    updatedAt: new Date(),
                })
            }
            for (const annotationId of annotationIds) {
                insert_arr.push({
                    collectionId,
                    annotationId,
                    type: "Annotation",
                    id: nanoid(),
                    updatedAt: new Date(),
                })
            }
            const collectionItems = await ctx.db.insertInto("CollectionItems")
                .values(insert_arr)
                .ignore()
                .execute();
            return { ..._collection, icon: _collection.icon as ChosenIcon };
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
            let collectionQuery = ctx.db.selectFrom("Collection")
                .select(["id", "name", "icon", "private", "userId", "icon", "updatedAt", "createdAt", "description"])
                .where("id", "=", id);

            if (ctx.userId) {
                collectionQuery = collectionQuery.where("userId", "=", ctx.userId)
            } else {
                collectionQuery = collectionQuery.where("private", "=", false)
            }
            console.log({ id })
            // select c.id, c.position, c.note, c.parentId, c.type, e.title as entry_title, e.id as entry_id, e.uri as entry_uri, e.author as entry_author, e.image as entry_image, e.published as entry_published, e.type as entry_type, a.type as annotation_type, a.body as annotation_body, a.contentData as annotation_contentData, a.title as annotation_title, a.chosenIcon as annotation_icon, a.id as annotation_id, a.updatedAt as annotation_updatedAt from CollectionItems as c
            // left join Entry e on e.id = c.entryId
            // left join Annotation a on a.id = c.annotationId
            // where collectionId = 30;
            let itemsQuery = ctx.db.selectFrom("CollectionItems as c")
                .leftJoin("Entry as e", "e.id", "c.entryId")
                .leftJoin("Annotation as a", "a.id", "c.annotationId")
                .select([
                    "c.id",
                    "c.position",
                    "c.note",
                    "c.parentId",
                    "c.type",
                    "e.title as entry_title",
                    "e.id as entry_id",
                    "e.uri as entry_uri",
                    "e.author as entry_author",
                    "e.image as entry_image",
                    "e.published as entry_published",
                    "e.type as entry_type",
                    "a.type as annotation_type",
                    "a.body as annotation_body",
                    "a.contentData as annotation_contentData",
                    "a.title as annotation_title",
                    "a.chosenIcon as annotation_icon",
                    "a.id as annotation_id",
                    "a.updatedAt as annotation_updatedAt"
                ])
                .where("collectionId", "=", id)
                .orderBy("position", "asc");
            const [collection, items] = await Promise.all([
                collectionQuery.executeTakeFirstOrThrow(),
                itemsQuery.execute(),
            ]);
            console.log({ collection, items })

            // todo: transform items into array of objects with nested annotations and entries
            // here lies dragons
            interface CollectionItem {
                id: string;
                position: number;
                note: string | null;
                parentId: string | null;
                type: string;
                entry: {
                    title: string | null;
                    id: number;
                    uri: string | null;
                    author: string | null;
                    image: string | null;
                    published: Date | null;
                    type: string | null;
                } | null;
                annotation: {
                    type: Annotation["type"] | null;
                    body: string | null;
                    contentData: any;
                    title: string | null;
                    chosenIcon: any;
                    id: string;
                    updatedAt: Date | null;
                } | null;
                children: CollectionItem[];
            }

            const itemMap = new Map<string, CollectionItem>();
            const rootItems: CollectionItem[] = [];

            // first pass: build itemMap and rootItems
            for (const item of items) {
                const collectionItem: CollectionItem = {
                    id: item.id,
                    position: item.position,
                    note: item.note,
                    parentId: item.parentId,
                    type: item.type,
                    entry: item.entry_id
                        ? {
                            title: item.entry_title,
                            id: item.entry_id,
                            uri: item.entry_uri,
                            author: item.entry_author,
                            image: item.entry_image,
                            published: item.entry_published,
                            type: item.entry_type,
                        } : null,
                    annotation: item.annotation_id
                        ? {
                            type: item.annotation_type,
                            body: item.annotation_body,
                            contentData: item.annotation_contentData,
                            title: item.annotation_title,
                            chosenIcon: item.annotation_icon,
                            id: item.annotation_id,
                            updatedAt: item.annotation_updatedAt,
                        } : null,
                    children: [],
                };
                itemMap.set(item.id, collectionItem)
                if (item.parentId === null) {
                    rootItems.push(collectionItem);
                }
            }
            for (const item of itemMap.values()) {
                if (!item.parentId) continue;
                const parent = itemMap.get(item.parentId);
                if (!parent) continue;
                parent.children.push(item);
            }
            console.log({ collection })
            return { ...collection, items: rootItems };
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
