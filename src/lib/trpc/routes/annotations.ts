// import { AnnotationType, Prisma } from "@prisma/client";
import type { JSONContent } from "@tiptap/core";
import { z } from "zod";

// import {
//     contextualAnnotationArgs
// } from "$lib/prisma/selects/annotations";
import { saveAnnotationSchema } from "$lib/prisma/zod-inputs";

import { protectedProcedure, router } from "../t";
import { nanoid } from "$lib/nanoid";
import { json } from "$lib/db";
import { sql } from "kysely";
import { annotations, contextual_annotation, withEntry } from "$lib/db/selects";

const idSchema = z.object({
    id: z.string() // <- cuid or nanoid
});

export const annotationWithBodySchema = idSchema.extend({ body: z.string().min(1) });

// TODO: clean up create, save, note, etc... into create, update, delete, etc.
export const annotationRouter = router({
    list: protectedProcedure.query(async ({ ctx, input }) => {
        const annotations = await ctx.db.selectFrom("Annotation as a")
            .innerJoin("user as au", "au.id", "a.userId")
            .select([
                "a.id",
                "a.contentData",
                "a.private",
                "a.color",
                "a.body",
                "a.target",
                "a.entryId",
                "a.parentId",
                "a.createdAt",
                "a.editedAt",
                "a.type",
                "a.color",
                "au.username",
                // sql<number>`SELECT count(*) FROM Annotation a WHERE a.parentId = a.id`.as(
                //     "children_count"
                // ),
            ])
            .where("a.userId", "=", ctx.userId)
            .where("a.deleted", "is", null)
            .where("a.type", "=", "annotation")
            .orderBy("a.createdAt", "desc")
            .execute();
        return annotations;
    }),
    search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        // REVIEW: how to handle Json and full text search?
        // or: should Body just be a string?
        // [path]?
        const { userId } = ctx;

        const [notes, rich_annotations] = await Promise.all([ctx.db.selectFrom("Annotation as a")
            .where(sql`MATCH(a.title,a.body,a.exact) AGAINST (${input})`)
            .select(annotations.select)
            .select(eb => [
                withEntry(eb),
                annotations.with.tags(eb),
                annotations.with.username(eb, 'creator')
            ])
            .where("a.userId", "=", ctx.userId)
            .where("a.contentData", "is", null)
            // TODO: paginate?
            .limit(25)
            .orderBy("a.createdAt", "desc").execute(),
        ctx.db.selectFrom("Annotation as a")
            .where("contentData", "is not", null)
            .where("userId", "=", userId)
            .select("contentData")
            .select(annotations.select)
            .select(eb => contextual_annotation(eb))
            .execute()
        ])
        // now filter richannotations
        console.time("filtering rich annotations")
        const matchingRichAnnotations: typeof rich_annotations = [];
        rich_annotations.forEach((a) => {
            const contentData = a.contentData as JSONContent;
            // walk through all "text" nodes and search for input
            let found = false
            function recurse(node: JSONContent) {
                // if (found) return true;
                if (node.type === "text") {
                    console.log(node.text, input)
                    if (node.text?.toLowerCase().includes(input.toLowerCase())) {
                        console.log("found", node.text)
                        found = true;
                        matchingRichAnnotations.push(a);
                        return true;
                    }
                }
                if (node.content && !found) {
                    node.content.forEach(recurse)
                }
            }
            recurse(contentData);
        })
        console.timeEnd("filtering rich annotations")
        console.log({ matchingRichAnnotations })
        return [...matchingRichAnnotations, ...notes];
    }),
    // TODO: consolidate save and update
    save: protectedProcedure.input(saveAnnotationSchema.extend({
        entryId: z.number().or(z.number().array())
    }).partial()).mutation(async ({ ctx, input }) => {
        const { id } = input;
        const { tags, entryId, ...rest } = input;
        // if there's an id, then update
        const ids: string[] = [];
        const entryIds = Array.isArray(entryId) ? entryId : [entryId];
        const data = {
            ...rest,
            contentData: rest.contentData ? json(rest.contentData) : null,
            target: rest.target ? json(rest.target) : null,
            type: "annotation",
            updatedAt: new Date(),
            // TODO
        } as const;
        const values = entryIds.map((entryId) => ({
            id: id ?? nanoid(),
            userId: ctx.userId,
            entryId,
            ...data
        } as const));
        // ids = values.map(v => v.id);
        await ctx.db.insertInto("Annotation").values(values)
            .onDuplicateKeyUpdate(data)
            .execute();
        return;
    }),
    note: protectedProcedure
        .input(
            z.object({
                entryId: z.number(),
                body: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { entryId, body } = input;
            const { userId } = ctx;
            const annotation = await ctx.prisma.annotation.create({
                data: {
                    entryId,
                    type: "note",
                    userId,
                    body,
                },
            });
            return annotation;
        }),
    delete: protectedProcedure.input(z.string().or(z.array(z.string()))).mutation(async ({ ctx, input }) => {
        // SOFT DELETE
        if (Array.isArray(input)) {
            const deleted = await ctx.prisma.annotation.updateMany({
                where: {
                    id: {
                        in: input,
                    },
                },
                data: {
                    deleted: new Date(),
                },
            });
            return deleted;
        } else {
            const annotationCount = await ctx.prisma.annotation.count({
                where: {
                    children: {
                        some: {},
                    },
                    id: input,
                },
            });
            if (annotationCount > 0) {
                const deleted = await ctx.prisma.annotation.update({
                    where: {
                        id: input,
                    },
                    data: {
                        deleted: new Date(),
                    },
                });
                return deleted;
            } else {
                const deleted = await ctx.prisma.annotation.delete({
                    where: {
                        id: input,
                    },
                });
            }
        }
    }),
    reply: protectedProcedure
        // REVIEW: should this take in an entryId?
        .input(annotationWithBodySchema)
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { id, body } = input;
            const annotation = await ctx.prisma.annotation.create({
                data: {
                    type: "reply",
                    body,
                    parentId: id,
                    userId,
                },
            });
            return annotation;
        }),
    // TODO: shold allow for limit, etc
    loadReplies: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        // needs to match same as entries.load["annotations"]
        .query(async ({ ctx, input }) => {
            const { id } = input;
            const replies = await ctx.prisma.annotation.findMany({
                where: {
                    parentId: id,
                },
                include: {
                    creator: {
                        select: {
                            username: true,
                        },
                    },
                    _count: {
                        select: {
                            children: true,
                        },
                    },
                },
            });
            return replies.map((reply) => {
                if (reply.deleted) {
                    return {
                        ...reply,
                        body: "",
                    };
                } else {
                    return reply;
                }
            });
        }),
    create: protectedProcedure.input(saveAnnotationSchema.partial()).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const { entryId, collectionId, tags, ...rest } = input;
        return await ctx.prisma.annotation.create({
            data: {
                ...rest,
                entry: entryId ? {
                    connect: {
                        id: input.entryId,
                    }
                } : undefined,
                type: input.type || "annotation",
                creator: {
                    connect: {
                        id: userId
                    }
                },
                collections: collectionId ? {
                    create: {
                        collectionId,
                    }
                } : undefined,
                tags: tags ? {
                    connectOrCreate: tags.map(t => ({
                        where: {
                            name_userId: {
                                name: t.name,
                                userId
                            }
                        },
                        create: {
                            name: t.name,
                            userId
                        }
                    })),
                } : undefined
            },
        });
    }),
    detail: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
        const { id } = input;
        const annotation = await ctx.prisma.annotation.findUnique({
            where: {
                id,
            },
            include: {
                creator: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        children: true,
                    },
                },
                entry: {
                    select: {
                        title: true
                    }
                },
                collections: {
                    select: {
                        collection: true
                    }
                }
            },
        });
        if (!annotation) return null;
        return { ...annotation, contentData: annotation.contentData as JSONContent | null };
    })
});
